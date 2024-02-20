import { React } from "react";
import { Card, Row, Col } from "antd";
import { ReactSVG } from "react-svg";
import arrowLeft from "../../../assets/images/arrow_left.svg";
import close from "../../../assets/images/close_btn (Hover State).svg";

import {
  Switch,
  Route,
  useHistory,
  useRouteMatch,
  Link,
} from "react-router-dom";

export default function HeaderOfChat(props) {
  const NickName = {
    fontFamily: "Niveau Grotesk Bold",
    fontSize: "19px",
    color: "#FFFFFF",
  };
  const backToMessages = props.backToMessages;
  let pathToFriends = "/app/index/friends";
  let pathToMessages = "/app/index/messages";

  return (
    <Row>
      <Col
        span={24}
        style={{ padding: 10, height: 59, borderBottom: "1px solid #393939" }}
      >
        <Row style={{ marginLeft: 10 }}>
          <Col span={3} style={{ marginTop: 10 }} className="opacity">
            <Link to={backToMessages ? pathToMessages : pathToFriends}>
              <div>
                <ReactSVG src={arrowLeft}></ReactSVG>
              </div>
            </Link>
          </Col>
          <Col span={18} style={{ marginTop: 7 }}>
            <span style={NickName}>{props.userNickName}</span>
          </Col>
          <Col span={1} onClick={props.onExitChat}>
            <div className="backgroundForSVG">
              <ReactSVG src={close}></ReactSVG>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
