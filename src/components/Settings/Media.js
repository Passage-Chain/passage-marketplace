import React, { useEffect, useState } from 'react';
import './index.scss';
import { Layout, Row, Col} from 'antd';
import { AudioSetting, VideoSetting } from '../InitialSetup/AudioVideo';
import { useSelector } from "react-redux";
import accountHttpService from "../../services/account";
import Toast from '../custom/CustomToast';
import { handleApiError } from '../utils/AuthVerify/AuthVerify';
import useDevices from "../../hooks/useDevices";

const { Content } = Layout;

const Media = () => {
  useDevices();
  const [mute, setMute] = useState(false)
  const [video , setVideo] = useState(true)

  useEffect(()=>{
    accountHttpService
      .getUserAudioVideoInfo()
      .then((response) => {
        const { mute, video } = response.data.audioVideoInfo;
        setMute(mute === null ? false : mute)
        setVideo(video === null ? true : video)
      })
      .catch((error) => {
        handleApiError(error);
      });
  }, []);

  const onSaveClick = () => {
    accountHttpService
      .updateUserAudioVideoInfo({ mute, video })
      .then((response) => {
        if (response.status === 200 && response.data) {
          Toast.success('Media Settings', "Audio video setting is updated successfully");
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  }

  const toggleMic = () => {
    setMute(!mute)
  }

  const toggleCam = () => {
    setVideo(!video)
  }

  return (
      <Layout className="site-layout background-none" style={{'backgroundColor': '#001529'}}>
        <Content
          style={{

            minHeight: 280,

          }}
        >
          <h2 className="setting-header" style={{fontSize: '24px'}}>AUDIO AND VIDEO</h2>
          {/** Audio Section */}
         <div className='section-layout-outer'>
           <div className='section-header'>
              AUDIO
           </div>
           <div className='section-layout-inner' style={{height: '370px'}}>
            <Row align='center' style={{width:"100%"}}>
              <AudioSetting 
                isMute={mute} 
                toggleMic={toggleMic}
              />
            </Row>
           </div>
         </div>
         {/** Video Section */}
         <div className='section-layout-outer mt-15'>
           <div className='section-header'>
              VIDEO
           </div>
           <div className='section-layout-inner' style={{height: '480px'}}>
            <VideoSetting 
              isVideoEnabled={video} 
              toggleCam={toggleCam} 
            />
           </div>
         </div>
         <Row align='left' className='mt-15'>
            <Col>
              <button className='setting-button setting-button-active' onClick={onSaveClick}>
                SAVE CHANGES
              </button>
            </Col>
            <Col style={{marginLeft: "15px"}}>
              <button className='setting-button setting-button-active'>
                CANCEL
              </button>
            </Col>
          </Row>

        </Content>
      </Layout>
  );
};

export default Media;
