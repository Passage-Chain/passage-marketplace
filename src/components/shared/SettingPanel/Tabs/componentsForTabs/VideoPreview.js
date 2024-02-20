import { React, useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Toast from '../../../../custom/CustomToast';
import { useHistory } from 'react-router-dom';
export default function VideoPreview(params) {
  const app = useSelector((state) => state.app);
  const history = useHistory();
  const videoPreview = {
    width: "50vh",
    height: "30vh",
    background: "#393939",
  };
  const videoRef = useRef(null);
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: {deviceId: app.selectedVideoDevice} })
      .then((stream) => {
        let video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.onloadedmetadata = function (e) {
            video.play();
          };
        }
      })
      .catch((error) => {
        Toast.error('error', error.response.data.message);
        
      });
  });
  return (
    <div style={videoPreview}>
      <video style={videoPreview} ref={videoRef}></video>
    </div>
  );
}
