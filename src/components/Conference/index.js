import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tooltip } from 'antd'

//import '../../services/agoraScreenshare';
import { start as startSharing, stop as stopSharing, isSharing } from '../../services/agoraScreenshare';

import agoraService from "../../services/agora";

import {
  setIsMicMuted,
  setIsAudioDisabled,
  setIsVideoDisabled,
  setTouchControl
} from "../../redux/appSlice";

import Avatar from "../../assets/images/left_menu_passageLogo.svg";
import { ReactComponent as MicrophoneOnIcon } from '../../assets/images-v2/microphone-on.svg'
import { ReactComponent as CameraOnIcon } from '../../assets/images-v2/camera-on.svg'
import { ReactComponent as SpeakerOnIcon } from '../../assets/images-v2/speaker-on.svg'
import { ReactComponent as MicrophoneOffIcon } from '../../assets/images-v2/microphone-off.svg'
import { ReactComponent as CameraOffIcon } from '../../assets/images-v2/camera-off.svg'
import { ReactComponent as SpeakerOffIcon } from '../../assets/images-v2/speaker-off.svg'
import { ReactComponent as ShareIcon } from '../../assets/images-v2/share-icon.svg'
import { ReactComponent as ViewScreenIcon } from '../../assets/images-v2/view-screen-icon.svg'
import { ReactComponent as TouchOnIcon } from '../../assets/images-v2/touch-on.svg'

import './index.scss'

const Conference = () => {
  const dispatch = useDispatch();

  const account = useSelector((state) => state.account);
  const app = useSelector((state) => state.app);

  const videoRef = useRef(null);

  useEffect(() => {
    !app.isVideoDisabled ? getVideo() : stopVideo();
    let videoEl = videoRef.current;

    return () => {
      stopVideo(videoEl);
    }
  }, [app.isVideoDisabled]);

  const changeWebCamState = () => {
    const disable = !app.isVideoDisabled;

    agoraService.updateStateVideoTrack(disable);
    dispatch(setIsVideoDisabled(disable));
  }

  const changeMicState = () => {
    const mute = !app.isMicMuted;

    agoraService.updateStateAudioTrack(mute);
    dispatch(setIsMicMuted(mute));
  }

  /**
   * Mute or unmute the world audio.
   * TODO: Audio is currently playing through the HTML5VideoElement and HTML5AudioElement
   */
  const changeSoundState = () => {
    const els = document.querySelectorAll("video#pixel-stream, audio#pixel-stream-audio");
    const muted = !app.isAudioDisabled;

    els.forEach(el => {
      el.muted = muted;
    });

    dispatch(setIsAudioDisabled(muted));
  }

  const changeControls = () => {
     if (!app.touchControl) {
      dispatch(setTouchControl(true));
    } else {
      dispatch(setTouchControl(false));
    }
  }

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          deviceId: app.selectedVideoDevice
        }
      })
      .then((stream) => {
        let video = videoRef?.current;
        if (video) {
          video.srcObject = stream;
          video.onloadedmetadata = function (e) {
            video.play();
          };
        }
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  const stopVideo = (video) => {
    if (video?.srcObject) video.srcObject.getTracks()[0].stop();
  }

  const renderVideo = () => {
    return (
      <div className="gc-media-video-container">
        { !app.isVideoDisabled ?
          ( <video id="streamingCameraVideo" className="gcmv-inner-container" ref={videoRef} /> ) :
          ( <img id="streamingCameraVideo" className="gcmv-inner-container" src={account.image || Avatar } alt="My Avatar"/> )
        }
      </div>
    )
  }

  // TODO: Change icon based on sharing state
  const shareScreen = () => {
    isSharing ? stopSharing() : startSharing();
  }

  const renderMoreOptions = () => {
    return (
      <div className="gc-more-options">
        <Tooltip placement="top" title="View Screen">
          <div className="gcmore-icon-wrapper">
            <ViewScreenIcon />
          </div>
        </Tooltip>
        <Tooltip placement="top" title="Share Screen">
          <div className="gcmore-icon-wrapper">
            <ShareIcon onClick={shareScreen}/>
          </div>
        </Tooltip>
      </div>
    )
  }

  const renderMediaOptions = () => {
    return (
      <div className="gc-media-options-container">
        <Tooltip placement="top" title={app.isMicMuted ? 'Unmute' : 'Mute'}>
          <div className="gcmo-icon-wrapper" onClick={changeMicState}>
            {app.isMicMuted ?
              <MicrophoneOffIcon /> :
              <MicrophoneOnIcon />
            }
          </div>
        </Tooltip>
        <Tooltip placement="top" title={app.isAudioDisabled ? 'Speaker On' : 'Speaker Off'}>
          <div className="gcmo-icon-wrapper" onClick={changeSoundState}>
            {app.isAudioDisabled ?
              <SpeakerOffIcon /> :
              <SpeakerOnIcon />
            }
          </div>
        </Tooltip>
        <Tooltip placement="top" title={app.isVideoDisabled ? 'Camera On' : 'Camera Off'}>
          <div className="gcmo-icon-wrapper" onClick={changeWebCamState}>
            {app.isVideoDisabled ?
              <CameraOffIcon /> :
              <CameraOnIcon />
            }
          </div>
        </Tooltip>
        <Tooltip placement="top" title={app.touchControl ? 'Touch Controls On' : 'Touch Controls Off'}>
          <div className="gcmo-icon-wrapper" onClick={changeControls}>
            <TouchOnIcon style={{ height: "70%", width: "auto" }} className={ app.touchControl ? '' : 'icon-off' }/>
          </div>
        </Tooltip>

      </div>
    )
  }
  return (
    <div className="game-conference-container">
      {renderVideo()}
      {account.isSuperUser && renderMoreOptions()}
      {renderMediaOptions()}
    </div>
  )
}

export default Conference
