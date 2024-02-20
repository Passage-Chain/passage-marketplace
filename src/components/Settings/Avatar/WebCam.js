import React from 'react';
import Webcam from "react-webcam";
import {
  CameraOutlined,
  CheckOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

const videoConstraints = {
  width: 350,
  height: 350,
  facingMode: "user"
};

const WebCam = ({ saveWebCam, openWebcam }) => {
  const [url, setUrl] = React.useState(null);

  return (
    <div className="profile-webcam">
      {url ?
        <div className='captured-image'>
          <img src={url} alt="Screenshot" />
          <button className='recapture' onClick={() => setUrl(null)}><CameraOutlined /> Capture Again</button>
          <button className='save' onClick={() => { saveWebCam({ cameraImage: url }); openWebcam(false) }}><CheckOutlined /> Use</button>
        </div>
        :
        <Webcam
          audio={false}
          height={350}
          screenshotFormat="image/jpeg"
          width={350}
          videoConstraints={videoConstraints}
        >
          {({ getScreenshot }) => (
            <button
              className='capture'
              onClick={() => {
                const imageSrc = getScreenshot();
                setUrl(imageSrc);
              }}
            >
              <CameraOutlined />
            </button>
          )}
        </Webcam>
      }
      <CloseCircleOutlined className='close-webcam' onClick={() => openWebcam(false)} />
    </div>
  );
};

export default WebCam;