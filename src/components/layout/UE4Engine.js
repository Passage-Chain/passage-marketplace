import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import agoraConfig from "../../agora.config";
import agoraService from "../../services/agora";

import GameInstance from "../../services/gameInstance";
import accountService from "../../services/account";

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

export default function UE4Engine({ init }) {
  /* Load UE4RTC */
  const account = useSelector((state) => state.account);
  const [game, setGame] = useState();

  const setupNewGame = (gameUrl, serverLocation) => {
    const video = document.getElementById('pixel-stream');
    const audio = document.getElementById('pixel-stream-audio');
    let game;

    game = GameInstance.connect(gameUrl, video, audio);

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

    setGame(game);

    window.addEventListener('resize', throttled(400, () => {
      game.setResolution(window.innerWidth, window.innerHeight);
    }));

    game.client.onInteractionRequired.add(() => {
      const button = document.getElementById('pixel-stream-play-button');
      button.style.display = "initial";
      game.client.onStreamPlaying.add(() => {
        button.remove();
      });
    });

    // channelName can be the same as the serverLocation (which is the id of the EC2 instance)
    const channelName = serverLocation;
    accountService.getAgoraToken(account.token, channelName)
        .then((response => {
            const { token, uid } = response.data;

            agoraService.createClient(channelName, token, uid, true, true);
        }));
  }

  useEffect(() => {
    async function connect() {
      try {
          const { url, serverLocation }  = await init();
          setupNewGame(url, serverLocation);
      } catch(error) {
          console.error(error);
      }
    }

    connect();

    return () => {
      console.info("UE4Engine unmounted, cleaning up...");
      agoraService.deleteClient();
      game.client.stop();
      game.disconnect();
      GameInstance.disconnect();
      setGame();
    }
  }, []);

  return (
    <>
      <video id="pixel-stream"></video>
      <audio id="pixel-stream-audio"></audio>
      <div id="pixel-stream-play-button" style={{display: "none"}}></div>
    </>
  );
}
