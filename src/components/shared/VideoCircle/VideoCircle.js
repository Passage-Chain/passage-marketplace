import React, { Component, useState, useEffect, useRef } from "react";
import {
  setIsMicMuted,
  setIsAudioDisabled,
  setIsVideoDisabled,
} from "../../../redux/appSlice";
import { setVideoStream } from "../../../redux/appSlice";
import { useSelector, useDispatch } from "react-redux";
import Toast from '../../custom/CustomToast';
import { useHistory } from 'react-router-dom';

function VideoCircle(props) {
  const dispatch = useDispatch();
  const app = useSelector((state) => state.app);
  const videoRef = useRef(null);
  const [camState, setCamState] = useState(props.state);
  const history = useHistory();
  useEffect(() => {
    !app.isVideoDisabled ? getVideo() : offVideo();
  });
  useEffect(() => {
    !app.isVideoDisabled ? getVideo() : offVideo();
  }, [app.selectedVideoDevice]);

  useEffect(() => {
    const videoEl = videoRef.current;
    return () => {
      console.log("VideoCircle unmounted, cleaning up...");
      const tracks = videoEl.srcObject.getTracks();
      tracks.forEach((track) => {
        console.log(track);
        track.stop()
      });
      videoEl.srcObject = null;
    }
  }, [])

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: {deviceId: app.selectedVideoDevice},
      })
      .then((stream) => {
        let video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          //dispatch(setVideoStream(stream));
          video.onloadedmetadata = function (e) {
            video.play();
          };
        }
      })
      .catch((error) => {
        Toast.error('error', error.response.data.message);
      });
  };
  let circleWidth = 130;
  let circleHeight = 130;
  let mult;
  props.isDesktop ? (mult = 192 / 130) : (mult = 1);
  if (props.isDesktop) {
    circleWidth = 200;
    circleHeight = 200;
  }
  function offVideo() {
    let video = videoRef.current;
    if (video.srcObject) video.srcObject.getTracks()[0].stop();
  }

  const upper = {
    position: "relative",
    background: "#232323",
    borderRadius: "60%",
    display: "inline-block",
    width: circleWidth + "px",
    height: circleHeight + "px",
    left: "100px",
    top: "20px"
  };
  const mid = {
    display: "inline-block",
    width: !props.isDesktop ? circleWidth - 8 * mult + "px" : "192px",
    height: !props.isDesktop ? circleHeight - 8 * mult + "px" : "192px",
    borderRadius: "60%",
    background: "linear-gradient(to top, #451CFF, #B261FA)",
    margin: "0 auto",
    marginTop: !props.isDesktop ? "3%" : "4px",
    marginLeft: !props.isDesktop ? "3%" : "4px",
    zIndex: "100",
  };

  const inside = {
    width: !props.isDesktop ? circleWidth - 20 * mult + "px" : "182px",
    height: !props.isDesktop ? circleHeight - 20 * mult + "px" : "182px",
    background: "#232323",
    borderRadius: "60%",
    display: "inline-block",
    marginTop: !props.isDesktop ? "5%" : "5px",
    marginLeft: !props.isDesktop ? "5%" : "5px",
  };
  const video = {
    width: !props.isDesktop ? circleWidth - 30 * mult + "px" : "172px",
    height: !props.isDesktop ? circleHeight - 30 * mult + "px" : "172px",
    background: "#000000",
    borderRadius: "60%",
    marginTop: !props.isDesktop ? "5%" : "5px",
    marginLeft: !props.isDesktop ? "5%" : "5px",
  };
  return (
    <div className="upper" style={upper}>
      <div className="mid" style={mid}>
        <div className="inside" style={inside}>
          <div className="video" style={video}>
            <video
              id="webcam-video"
              style={{
                width: !props.isDesktop
                  ? circleWidth - 30 * mult + "px"
                  : "172px",
                height: !props.isDesktop
                  ? circleHeight - 30 * mult + "px"
                  : "172px",
                marginLeft: "0",
                borderRadius: "60%",
                objectFit: "cover",
              }}
              ref={videoRef}
            ></video>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCircle;
