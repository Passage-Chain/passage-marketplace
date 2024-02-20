import { React } from "react";
import { Card, Row, Col } from "antd";
import { ReactSVG } from "react-svg";
import arrowLeft from "../../../../assets/images/arrow_left.svg";
import close from "../../../../assets/images/close_btn (Hover State).svg";

import {
  Switch,
  Route,
  useHistory,
  useRouteMatch,
  Link,
} from "react-router-dom";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

export default function MobileHeaderOfChat(props) {
  const screens = useBreakpoint();
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
      <Col span={24} style={{ paddingLeft:15, paddingTop: 7, borderBottom: "1px solid #393939",paddingBottom:10 }}>
        <Row>
          <Col xs={2} sm={2} style={{ marginTop: 10 }} className="opacity">
            <Link to={backToMessages ? pathToMessages : pathToFriends}>
              <div>
                <ReactSVG src={arrowLeft}></ReactSVG>
              </div>
            </Link>
          </Col>
          <Col xs={19} sm={20} style={{ marginTop: 7 }}>
            <span style={NickName}>{props.userNickName}</span>
          </Col>
          <Col xs={1} sm={1} onClick={props.onExitChat} >
            <div className="backgroundForSVG">
            <ReactSVG src={close}></ReactSVG>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
