import { React } from "react";
import { Row, Col, Card, Tabs, Radio, Space } from "antd";

import Avatar from "./componentsForTabs/Avatar";
import Cancel from "./componentsForTabs/Cancel";
import ButtonText from "./componentsForTabs/ButtonText";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { setSettingsTabDefault } from "../../../../redux/accountSlice";
import accountHttpService from "../../../../services/account";
import { Switch, Route, useHistory, useRouteMatch } from "react-router-dom";
import Toast from '../../../custom/CustomToast';
export default function AccountTab() {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const history = useHistory()
  const [changes, setChanges] = useState(null);
  const [changedAvatar, setChangedAvatar] = useState(null);
  const [changedEmail, setChangedEmail] = useState(null);
  const [changedUserName, setChangedUserName] = useState(null);
  const [changedOldPassword, setChangedOldPassword] = useState(null);
  const [changedNewPassword, setChangedNewPassword] = useState(null);
  const [changedConfirmPassword, setChangedConfirmPassword] = useState(null);

  useEffect(() => {
    dispatch(setSettingsTabDefault("1"));
  }, []);
  const title = {
    fontSize: "19px",
    fontFamily: "Open Sans",
    color: "#FFFFFF",
  };
  const input = {
    borderRadius: "20px",
    background: "#040206",
    color: "#FFFFFF",
    fontSize: "16px",
    fontFamily: "Montserrat",
    paddingLeft: "10px",
    paddingTop: "4px",
    paddingBottom: "4px",
    width: "90%",
    height: "100%",
    marginTop: 5,
    border: "none",
  };
  function sumbitChanges() {
    let currChanges = new Object();
    if (changedAvatar && changedAvatar !== "") {
      currChanges["avatar"] = changedAvatar;
    }
    if (changedUserName && changedUserName !== "") {
      currChanges["userName"] = changedUserName;
    }
    if (changedEmail && changedUserName !== "") {
      currChanges["email"] = changedEmail;
    }
    if (changedOldPassword && changedOldPassword !== "") {
      if (changedNewPassword && changedNewPassword !== "") {
        if (changedNewPassword === changedConfirmPassword) {
          currChanges["oldPassword"] = changedOldPassword;
          currChanges["newPassword"] = changedNewPassword;
        }
      }
    }
    console.log(currChanges);
    accountHttpService
      .updateUser(account.token, currChanges)
      .then((response) => console.log(response))
      .catch((error) => {
        Toast.error('error', error.response.data.message);
        
      });
    setChangedAvatar("");
    setChangedEmail("");
    setChangedUserName("");
    setChangedOldPassword("");
    setChangedNewPassword("");
    setChangedConfirmPassword("");
  }
  return (
    <Row>
      <Col span={24}>
        <Row>
          <Col span={24} style={{ marginTop: 20 }}>
            <span style={title}>Avatar Image</span>
          </Col>
        </Row>
        <Row>
          <Col span={6} style={{ marginTop: 15 }}>
            <Avatar />
          </Col>
          <Col span={7} style={{ marginTop: 50 }}>
            <Cancel height="50%" />
          </Col>
          <Col span={7} style={{ marginTop: 50, marginLeft: 30 }}>
            <ButtonText text="CHANGE" height="50%" />
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginTop: "16px" }}>
            <span style={title}>Change Username</span>
          </Col>
        </Row>
        <Row>
          <Col span={23} style={{ marginTop: "16px" }}>
            <input
              value={changedUserName}
              onChange={(e) => setChangedUserName(e.target.value)}
              className="auth-input"
              placeholder="Username"
            ></input>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginTop: "10px" }}>
            <span style={title}>Change Email</span>
          </Col>
        </Row>
        <Row>
          <Col span={23} style={{ marginTop: "16px" }}>
            <input
              value={changedEmail}
              onChange={(e) => setChangedEmail(e.target.value)}
              className="auth-input"
              placeholder="Email"
            ></input>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginTop: "10px" }}>
            <span style={title}>Change Password</span>
          </Col>
        </Row>
        <Row>
          <Col span={23} style={{ marginTop: "16px" }}>
            <input
              value={changedOldPassword}
              onChange={(e) => setChangedOldPassword(e.target.value)}
              className="auth-input"
              placeholder="Original password"
            ></input>
          </Col>
          <Col span={23}>
            <input
              value={changedNewPassword}
              onChange={(e) => setChangedNewPassword(e.target.value)}
              className="auth-input"
              placeholder="New password"
            ></input>
          </Col>
          <Col span={23}>
            <input
              value={changedConfirmPassword}
              onChange={(e) => setChangedConfirmPassword(e.target.value)}
              className="auth-input"
              placeholder="Confirm password"
            ></input>
          </Col>
        </Row>
        <Row>
          <Col span={10} style={{ marginTop: "10px", marginBottom: 20 }} onClick={() => history.push("/app/index")}>
            <Cancel height="120%" />
          </Col>
          <Col
            onClick={sumbitChanges}
            span={10}
            style={{ marginTop: "10px", marginBottom: 20, marginLeft: 25 }}
          >
            <ButtonText text="UPDATE" height="120%"></ButtonText>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
