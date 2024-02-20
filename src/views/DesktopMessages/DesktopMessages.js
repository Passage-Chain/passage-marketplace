import { React } from "react";
import MessagesTable from "../../components/shared/MessagesTable/MessagesTable";
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
import DesktopheaderMessages from "./DesktopHeaderMassages";
import { Link } from "react-router-dom";
export default function DesktopMessages({
  onMassagesClick,
  onExitMassagesClick,
}) {
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
    <Row style={{ pointerEvents: "auto" }}>
      <div
        style={{
          background: "gray",
          opacity: "0.5",
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
      ></div>
      <Col span={24}>
        <Row justify={"end"}>
          <Col>
            <Row
              style={{
                background: "#282828",
                width: 400,
                borderRadius: "10px",
              }}
            >
              <Col span={24}>
                <Row>
                  <Col span={24}>
                    <DesktopheaderMessages
                      onExitMassagesClick={onExitMassagesClick}
                    />
                  </Col>
                </Row>
                {/* <div className="pointer">
                  <Link to={"/app/index/global-chat"}>
                    <Row style={ChatButton}>
                      <Col span={24}>
                        <span style={GlobalChat}>Global Chat</span>
                      </Col>
                    </Row>
                  </Link>
                </div> */}
                <Row>
                  <Col
                    span={24}
                    style={{
                      height: "70vh",
                      overflow: "scroll",
                      overflowX: "hidden",
                    }}
                  >
                    <MessagesTable />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
