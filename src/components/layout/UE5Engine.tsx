import { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import agoraService from "../../services/agora";

import GameInstance from "../../services/gameInstance";
import accountService from "../../services/account";

import { setIsInWorld } from '../../redux/worldSlice'
import { RootState } from '../../../_types/types';

import { InputMode } from "src/libs/PixelStreamClient";
import { BackoffError, BackoffPromise } from "src/utils/backoff";

/**
 * A helper function that throttles calls to an underlying function until
 * successive calls are separated in time by at least the value of the
 * `latency` parameter. This is used by the resize event handler to ensure that
 * the user has settled on a new window size before requesting the change in
 * aspect ratio from the game.
 */
const throttled = (latency, fn) => {

  let timeoutId = null;

  return (...args) => {
    if(timeoutId != null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args)
    }, latency);
  }
};

export default function UE5Engine({ accountToken, world, updateStatus }) {
  /* Load UE5RTC */
  const account = useSelector((state: RootState) => state.account);
  const app = useSelector((state: RootState) => state.app);
  const [game, setGame] = useState<GameInstance>();
  const dispatch = useDispatch();
  let gameInstancePromise: BackoffPromise<any>;

  const setupNewGame = (
    gameUrl: string,
    serverLocation: string
    ): Promise<void> =>
  {
    return new Promise((resolve, reject) => {
        const video = document.getElementById('pixel-stream');
        const audio = document.getElementById('pixel-stream-audio');

        const game =
            GameInstance.connect(gameUrl, video, audio) as GameInstance;

        const wsErrorHandler = () => {
            if(resizeThrottled) {
                window.removeEventListener('resize', resizeThrottled);
            }
            reject();
        }
        game.client.onWebSocketError.add(wsErrorHandler);
        game.client.onWebSocketOpen.add(() => {
            setGame(game);
            game.client.onWebSocketError.delete(wsErrorHandler);

            // channelName can be the same as the serverLocation (which is the id of the EC2 instance)
            const channelName = serverLocation;
            accountService.getAgoraToken(account.token, channelName)
                .then((response => {
                    const { token, uid } = response.data;

                    agoraService.createClient(channelName, token, uid, true, true);
                }));

            // We've successfully connected to UE and A/V
            dispatch(setIsInWorld(true));
            resolve();
        });

        game.client.setInputMode(
            app.touchControl ? InputMode.simple : InputMode.pro);

        game.client.onIoReady.add(() => {
          game.setResolution(window.innerWidth, window.innerHeight);
        });

        game.client.onIoReady.add(async () => {
            try {
                const token = await accountService.getGameSessionToken(
                    account.token);
                await game.init(token);
            } catch(error) {
                console.error(
                    "UE4Engine.js unable to initialize game instance",
                    error);
            }
        });

        game.client.onGameDisconnect.add(() => {
            dispatch(setIsInWorld(false));
        });

        const resizeThrottled = throttled(400, () => {
            game.setResolution(window.innerWidth, window.innerHeight);
          });
        window.addEventListener('resize', resizeThrottled);

        game.client.onInteractionRequired.add(() => {
          const button = document.getElementById('pixel-stream-play-button');
          button.style.display = "initial";
          game.client.onStreamPlaying.add(() => {
            button.remove();
          });
        });
    });
  }

  async function connect() {
    updateStatus('Connecting');

    let gameUrl: string;
    let serverLocation: string;

    try {
      gameInstancePromise = accountService.getGameInstanceUrl(
          accountToken,
          world.worldName.replaceAll(' ', ''));
      const response = await gameInstancePromise;

      //const response = { url: 'wss://i-046291e15f4759910.ps.passage.io:8888/browser', serverLocation: 'my-test-channel' }

      gameUrl = response.url;
      serverLocation = response.serverLocation;

    } catch(error) {
      updateStatus('No games available');
      // we expect BackoffError to occur routinely, so we won't log it.
      if(!(error instanceof BackoffError)) {
        console.error(error);
      }
      return;
    }

    updateStatus('Connecting to', gameUrl);
    console.info('Connecting to ', gameUrl, serverLocation);
    try {
        await setupNewGame(gameUrl, serverLocation);
    } catch(error) {
        GameInstance.disconnect();
        if(gameInstancePromise) gameInstancePromise.canceled = true;
        setTimeout(connect, 0);
        return;
    }
    updateStatus('Connected');
  }

  useEffect(() => {
    connect();
    return () => {
        try {
            //debugger;
            updateStatus("Disconnecting");
            console.info("UE5Engine unmounted, cleaning up...");
            dispatch(setIsInWorld(false));
            agoraService.deleteClient();
            GameInstance.disconnect();
            setGame(null);
            if(gameInstancePromise) gameInstancePromise.canceled = true;
        } catch(error) {
            console.error('UE5Engine useEffect cleanup', error);
        }
    };
  }, [accountToken, world]);

  /*
   * When a user changes control scheme while in world send a message to the game
   */
  useEffect(() => {
    if (game) {
      game.client.setInputMode(app.touchControl ? InputMode.simple : InputMode.pro);
    }
  }, [app.touchControl]);

  return (
    <>
      <video id="pixel-stream"></video>
      <audio id="pixel-stream-audio"></audio>
      <div id="pixel-stream-play-button" style={{display: "none"}}></div>
    </>
  );
}
