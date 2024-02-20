import { React } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Select,
  Button,
  Divider,
  Modal,
  Layout,
  Grid,
  Tag,
  List,
} from "antd";
import { ReactSVG } from "react-svg";
import arrowBack from "../../../assets/images/arrow_left.svg";
import CloseButton from "../../../assets/images/close_btn (Hover State).svg";
export default function HeaderOfGlobalChat({ backToMessages, onExitChat }) {
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
              <Col span={3} style={{ marginLeft: 15 }}>
                <div className="opacity">
                  <ReactSVG src={arrowBack} onClick={backToMessages}></ReactSVG>
                </div>
              </Col>
              <Col style={{ marginBottom: 5 }} span={17}>
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
