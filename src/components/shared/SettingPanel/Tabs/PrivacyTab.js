import { React } from "react";
import { Row, Col, Card, Tabs, Radio, Space, Select, Checkbox } from "antd";
import accountHttpService from "../../../../services/account";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Toast from '../../../custom/CustomToast';
import { useHistory } from 'react-router-dom';
import {
  setSearchUserName,
  setSearchFacebook,
  setMyVideo,
  setMyAudio,
  setSettingsTabDefault,
} from "../../../../redux/accountSlice";

export default function PrivacyTab() {
  const title = {
    fontSize: "19px",
    fontFamily: "Montserrat",
    color: "#FFFFFF",
    marginTop: "19px",
    fontStretch: "expanded",
  };
  const history = useHistory();
  const account = useSelector((state) => state.account);
  const [usernamePrivacy, setUsernamePrivacy] = useState(
    account.searchUserName
  );
  const [facebookPrivacy, setFacebookPrivacy] = useState(
    account.searchFacebook
  );
  const [videoPrivacy, setVideoPrivacy] = useState(account.myVideo);
  const [audioPrivacy, setAudioPrivacy] = useState(account.myAudio);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSettingsTabDefault("6"));
  }, []);

  function onChangePrivacy(e, type) {
    const checked = e.target.checked;
    console.log(checked);
    if (type === "userName") {
      setUsernamePrivacy(checked);
      dispatch(setSearchUserName(checked));
    }
    if (type === "facebook") {
      setFacebookPrivacy(checked);
      dispatch(setSearchFacebook(checked));
    }
    if (type === "video") {
      setVideoPrivacy(checked);
      dispatch(setMyVideo(checked));
    }
    if (type === "audio") {
      setAudioPrivacy(checked);
      dispatch(setMyAudio(checked));
    }
  }

  useEffect(() => {
    accountHttpService
      .updatePrivacy(
        account.token,
        usernamePrivacy,
        facebookPrivacy,
        videoPrivacy,
        audioPrivacy
      )
      .then((res) => {
        const data = res;
        console.log(data);
      })
      .catch((error) => {
        Toast.error('error', error.response.data.message);
       
      });
  }, [dispatch]);

  return (
    <Row>
      <Col span={21}>
        <Row>
          <Col span={24} style={title}>
            Discoverability
          </Col>
          <Col
            span={24}
            style={{
              color: "#909090",
              fontFamily: "Montserrat",
              fontSize: "14px",
              marginTop: "10px",
            }}
          >
            Select how other users can search for you.
          </Col>
          <Col span={24}>
            <Checkbox
              style={{
                fontFamily: "Montserrat",
                fontSize: "14px",
                color: "#909090",
                marginTop: "12px",
              }}
              checked={usernamePrivacy}
              onChange={(e) => onChangePrivacy(e, "userName")}
            >
              Allow users to search for you via username.
            </Checkbox>
          </Col>
          <Col span={24}>
            <Checkbox
              checked={facebookPrivacy}
              onChange={(e) => onChangePrivacy(e, "facebook")}
              style={{
                fontFamily: "Montserrat",
                fontSize: "14px",
                color: "#909090",
                marginTop: "12px",
              }}
            >
              Allow users to find you through Facebook.
            </Checkbox>
          </Col>
          <Col
            span={24}
            style={{
              fontSize: "19px",
              fontFamily: "Montserrat",
              color: "#FFFFFF",
              marginTop: "12px",
            }}
          >
            Communication Privacy
          </Col>
          <Col span={24}>
            <Checkbox
              checked={videoPrivacy}
              onChange={(e) => onChangePrivacy(e, "video")}
              style={{
                fontFamily: "Montserrat",
                fontSize: "14px",
                color: "#909090",
                marginTop: "10px",
              }}
            >
              Only users on your friend list can see your video feed.
            </Checkbox>
          </Col>
          <Col span={24}>
            <Checkbox
              style={{
                fontFamily: "Montserrat",
                fontSize: "14px",
                color: "#909090",
                marginTop: "12px",
              }}
              checked={audioPrivacy}
              onChange={(e) => onChangePrivacy(e, "audio")}
            >
              Only users on your friend list can hear your audio feed.
            </Checkbox>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
