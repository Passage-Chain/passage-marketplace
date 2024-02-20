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
import MobileHeaderMessages from "./MobileHeaderMessages";
import MessagesTable from "../../components/shared/MessagesTable/MessagesTable";
import { Link } from "react-router-dom";

export default function MobileMassages({
  onMassagesClick,
  onExitMassagesClick,
}) {
  const background = {
    background: "#404040",
    width: "100%",
    height: "100vh",
    pointerEvents: "auto",
  };
  const Panel = {
    background: "#282828",
    width: "98%",
    height: "96vh",
    marginLeft: "1%",
    marginTop: "1%",
    borderRadius: "15px",
    overflowY: "hide",
  };
  const text = {
    color: "#ffff",
    fontSize: "12px",
    fontFamily: "Montserrat",
  };
  const GlobalChat = {
    fontFamily: "Niveau Grotesk Bold",
    color: "#FFFFFF",
    fontSize: "20px",
  };
  const ChatButton = {
    background: "#393939",
    padding: "20px 20px",
  };
  return (
    <Row style={background} >
      <Col xs={24} sm={24} lg={24} >
        <Row style={Panel} id="mobile-fix-messages-panel">
          <Col xs={24} sm={24} md={24} lg={24}>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24}>
                <MobileHeaderMessages
                  onExitMassagesClick={onExitMassagesClick}
                  onMassagesClick={onMassagesClick}
                />
              </Col>
            </Row>
            {/* <div className="pointer">
              <Link to={"/app/index/global-chat"}>
                <Row style={ChatButton}>
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <span style={GlobalChat}>Global Chat</span>
                  </Col>
                </Row>
              </Link>
            </div> */}
            <Row style={{ overflowY: "auto" }}>
              <Col span={24}>
                <MessagesTable />
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
