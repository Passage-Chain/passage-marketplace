import { React, useEffect } from "react";
//import MessagesTable from "../../components/shared/MessagesTable/MessagesTable";
import {
  Row,
  Col,
} from "antd";
import DesktopHeaderDashboard from "./DesktopHeaderDashboard";
import SharedScreen from "./SharedScreen";
import agoraService from "../../services/agora";

export default function DesktopDashboard({
  onDashboardClick,
  onExitDashboardClick,
}) {

  useEffect(() => {

    async function getScreen () {
      let sharedScreen = await agoraService.getSharedScreen("shared-screen-container");
      let sharedScreenEl = document.querySelector("#shared-screen-container");
      if (sharedScreen) {
        sharedScreen.videoTrack.play(sharedScreenEl);
      }
    }

    getScreen();

    return function cleanup() {
      agoraService.removeSharedScreen();
    }
   })

  return (
    <Row style={{
      pointerEvents: "auto",
      height: "100%",
      background: "rgba(0, 0, 0, 0.6)",
      backdropFilter: "blur(10px)",
      opacity: 1,
      padding: "40px"

      }}>
      <Col span={24} style={{ backgroundColor: "rgba(0, 0, 0, 1)" }}>
        <Row justify={"center"}>
          <Col span={24}>
            <Row
              style={{
                background: "#000",
                opacity: 1,
                width: "100%",
                borderRadius: "4px",
              }}
            >
              <Col span={24}>
                <Row>
                  <Col span={24}>
                    <DesktopHeaderDashboard
                      onExitDashboardClick={onExitDashboardClick}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col
                    span={24}
                    style={{
                      height: "70vh",
                      overflow: "hidden"
                    }}
                  >
                    <SharedScreen 
                      style={{
                        width: "500px",
                        height: "400px"
                      }}
                    />
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
