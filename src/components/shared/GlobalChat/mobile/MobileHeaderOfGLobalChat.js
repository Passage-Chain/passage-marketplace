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
import arrowBack from "../../../../assets/images/arrow_left.svg";
import CloseButton from "../../../../assets/images/close_btn (Hover State).svg";

export default function MobileHeaderOfGLobalChat({
  backToMessages,
  onExitChat,
}) {
  const Messages = {
    fontFamily: "Niveau Grotesk Bold",
    color: "#ffff",
    fontSize: "18px",
  };

  return (
    <Row>
      <Col span={24}>
        <Row>
          <Col span={24}>
            <Row style={{ marginTop: 5 }} align={"middle"}>
              <Col xs={2} style={{ marginLeft: 15 }}>
                <ReactSVG src={arrowBack} onClick={backToMessages}></ReactSVG>
              </Col>
              <Col style={{ marginBottom: 5 }} xs={19}>
                <span style={Messages}>GLOBAL CHAT</span>
              </Col>
              <Col span={1} onClick={onExitChat}>
                <div
                  className="backgroundForSVG"
                  style={{ marginBottom: 7, marginTop: 3 }}
                >
                  <ReactSVG src={CloseButton}></ReactSVG>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
