import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { CustomSelect } from "../custom";
import useDevices from "../../hooks/useDevices";

import {
  setSelectedAudioDevice,
  setSelectedVideoDevice,
  setSelectedAudioOutputDevice,
  setAudioVolume
} from "../../redux/appSlice";

import { ReactComponent as VolumeIcon } from "../../assets/images/icon-volume.svg";
import { ReactComponent as MicrophoneIcon } from "../../assets/images/icon-microphone.svg";
import { ReactComponent as VolumeMuteIcon } from "../../assets/images/icon-mute-indicator.svg";
import { ReactComponent as MicrophoneOffIcon } from "../../assets/images/mic-off-icon.svg";
import testToneAudio from "../../assets/sounds/test-tone.mp3";
import "./index.scss";
import { Slider } from "antd";
import { Toggle } from "../shared/ToggelSwitch/Toggle";
import Toast from '../custom/CustomToast';
import agora from "../../services/agora";

const playTestTone = (sinkId) => {
  const audio = new Audio(testToneAudio);
  audio.play();
}

const VolumeSlider = () => {
  const dispatch = useDispatch()
  const app = useSelector((state) => state.app);
  return (
    <Slider
      className="av-volume-range"
      trackStyle={{ background: "#4E47F0" }}
      handleStyle={{ border: "#4E47F0", background: "#4E47F0" }}
      value={app.audioVolume}
      onChange={newVolume => { dispatch(setAudioVolume(newVolume)) }}
    />
  );
};

const MicrophoneLevel = ({ selectedAudioDevice, isMute }) => {
  let stream
  useEffect(() => {
    if(selectedAudioDevice || !isMute){
    navigator.mediaDevices
      .getUserMedia({
        audio: { deviceId: selectedAudioDevice },
      })
      .then(function (mediaStream) {
        stream = mediaStream
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;
        if(!isMute){
          microphone.connect(analyser);
          analyser.connect(scriptProcessor);
          scriptProcessor.connect(audioContext.destination);
          scriptProcessor.onaudioprocess = function () {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            const arraySum = array.reduce((a, value) => a + value, 0);
            const average = arraySum / array.length;
            colorPids(average);
          };
        } else {
          // microphone.disconnect(analyser);
          if (stream) { 
            stream.getTracks().forEach(function(track) { 
              track.stop(); 
            }); 
          } 
        }

      })
      .catch(function (error) {
        Toast.error('error', 'Something went wrong, please try again!');

      });

      return () => {
        if (stream) { 
          stream.getTracks().forEach(function(track) { 
            track.stop(); 
          }); 
        } 
      }
    }
  }, [selectedAudioDevice, isMute]);

  function colorPids(vol) {
    const allPids = [...document.querySelectorAll(".microphone-bar")];
    const numberOfPidsToColor = Math.round(vol / 10);
    const pidsToColor = allPids.slice(0, numberOfPidsToColor);
    for (const pid of allPids) {
      pid.style.backgroundColor = "#707070";
    }
    for (const pid of pidsToColor) {
      pid.style.backgroundColor = "#4E47F0";
    }
  }

  const bars = new Array(25).fill(undefined);
  return (
    <div className="av-microphone-range">
      {bars.map((bar, index) => (
        <div key={index} className="microphone-bar"></div>
      ))}
    </div>
  );
};

export const AudioSetting = ({ isMute, toggleMic }) => {
  const app = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const [localSelectedAudioDevice, setLocalSelectedAudioDevice] = useState(
    app.selectedAudioDevice
  );

  const [localSelectedAudioOutputDevice, setLocalSelectedAudioOutputDevice] =
    useState(app.selectedAudioOutputDevice);

  const localAudioOutputDevices = app.audioOutputDevices;

  const localAudioDevices = app.audioDevices;

  useEffect(() => {
    setLocalSelectedAudioDevice(app.selectedAudioDevice);
  }, [app.selectedAudioDevice]);

  useEffect(() => {
    setLocalSelectedAudioOutputDevice(app.selectedAudioOutputDevice);
  }, [app.selectedAudioOutputDevice]);

  return (
    <div className="av-setting__container">
      <div className="av-setting-inner__container">
        {/* <span className="av-setting__heading">AUDIO SETTINGS</span> */}

        <div className="av-setting__option-wrapper">
          <span className="av-setting__label">SPEAKER</span>
          <CustomSelect
            className="border-white"
            options={localAudioOutputDevices}
            value={localSelectedAudioOutputDevice}
            onChange={(value) => dispatch(setSelectedAudioOutputDevice(value))}
          />
          <div className="av-setting__option">
            { app.audioVolume !== 0 ? <VolumeIcon style={{ width: 18, height: 15 }} onClick={playTestTone}/> :
            <VolumeMuteIcon style={{ width: 18, height: 15 }} />}
            <VolumeSlider />
          </div>
        </div>

        <div className="av-setting__option-wrapper">
          <span className="av-setting__label">MICROPHONE</span>
          <CustomSelect
            options={localAudioDevices}
            value={localSelectedAudioDevice}
            onChange={(value) => dispatch(setSelectedAudioDevice(value))}
          />
          <div className="av-setting__option">
            { isMute ? <MicrophoneOffIcon style={{ width: 11, height: 17 }} /> :
            <MicrophoneIcon style={{ width: 11, height: 19 }} />}
            <MicrophoneLevel selectedAudioDevice={localSelectedAudioDevice} isMute={isMute} />
          </div>
        </div>
        <Toggle label={isMute ? 'Unmute' : 'Mute'} toggled={!isMute} onClick={toggleMic}></Toggle>
      </div>
    </div>
  );
};

export const VideoSetting = ({ isVideoEnabled, toggleCam }) => {
  const app = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const history = useHistory();
  const [localSelectedVideoDevice, setLocalSelectedVideoDevice] = useState(
    app.selectedVideoDevice
  );
  const localVideoDevices = app.videoDevices;
  const videoRef = useRef(null);

  useEffect(() => {
    if (isVideoEnabled) {
      getVideo();
    } else {
      let video = videoRef.current;
      video.srcObject.getTracks().forEach(track => {
        track.stop();
      })

      video.srcObject = null;
    }
  }, [isVideoEnabled, app.selectedVideoDevice]);

  useEffect(() => {
    setLocalSelectedVideoDevice(app.selectedVideoDevice);
  }, [app.selectedVideoDevice]);

  useEffect(() => {
    let _ref = null;
    if (videoRef.current) {
      _ref = videoRef.current;
    }

    return(() => {
      console.log("Disconnecting audio/video")
      if (_ref) {

        _ref.srcObject.getTracks().forEach(track => {
          console.log("Stopping track: ", track);
          track.stop();
        })

        _ref.srcObject = null;
      }
    })

  }, [videoRef]);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: { deviceId: app.selectedVideoDevice }
      })
      .then((stream) => {
        let video = videoRef.current;
        if (video && isVideoEnabled) {
          video.srcObject = stream;
          video.onloadedmetadata = function (e) {
            video.play();
          };
        } else {
          video.srcObject = stream;
          video.onloadedmetadata = function (e) {
            video.pause();
          };
        }
      })
      .catch((err) => {
        Toast.error('error', 'Something went wrong, please try again!');
        if(err.response.status )
           history.push('/')
      });
  };

  return (
    <div className="av-setting__container">
      <div className="av-setting-inner__container">
        {/* <span className="av-setting__heading">VIDEO SETTINGS</span> */}

        <div className="av-setting__option-wrapper">
          <div className="av_setting_center_wrapper">
            <div className="av-video-preview-wrapper">
              <video
                id="webcam-video"
                className="av-video-preview"
                ref={videoRef}
              />
            </div>
          </div>
          <span className="av-setting__label">CAMERA</span>
          <CustomSelect
            options={localVideoDevices}
            value={localSelectedVideoDevice}
            onChange={(value) => dispatch(setSelectedVideoDevice(value))}
          />

          <Toggle label={isVideoEnabled ? 'Disable Video' : 'Enable Video'} toggled={isVideoEnabled} onClick={toggleCam}></Toggle>
        </div>
      </div>
    </div>
  );
};

const AudioVideo = () => {
  useDevices();
  const history = useHistory();
  const [localDevices, setLocalDevices] = useState();

  useEffect(() => {
    return(() => {

    })
  }, localDevices);

  const updateLocalDevices = async () => {
    console.info("Updating local devices...");
    const devicesByKind = {};
    const devices = await navigator.mediaDevices.enumerateDevices();

    // Iterate devices and group them by device type (audioinput, audioutput, videoinput)
    devices.forEach((d) => {
      if (!devicesByKind[d.kind]) {
        devicesByKind[d.kind] = [];
      }

      // Set id to deviceId and add to list
      d.id = d.deviceId;
      devicesByKind[d.kind].push(d);
    })
    setLocalDevices(devicesByKind);
  }

  return (
    <div className="av__container">
      <div className="av__inner-container">
        <div className="av__header">
          <span className="av__heading">Initial Setup</span>
          <span className="av__sub-heading">
            Customize your audio settings
          </span>
        </div>

        <div className="av__body">
          <AudioSetting />
          <VideoSetting />
        </div>

      </div>
    </div>
  );
};

export default AudioVideo;
