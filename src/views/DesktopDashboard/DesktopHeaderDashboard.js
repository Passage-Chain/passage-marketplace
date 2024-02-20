import { React } from "react";
import {
  Row,
  Col,
} from "antd";
import { ReactSVG } from "react-svg";
import MassagesWithoutBackground from "../../assets/images/MassagesWithoutBackground.svg";
import CloseButton from "../../assets/images/close_btn (Hover State).svg";
export default function DesktophHeaderDashboard({ onExitDashboardClick }) {
  
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
              <Col span={0} style={{ marginLeft: 15 }}>
              </Col>
              { /*<Col style={{ marginBottom: 5 }} span={20}>
                <span style={Messages}>DASHBOARD</span>
              </Col>*/ }
              <Col span={24} align={"right"} onClick={onExitDashboardClick}>
                <div className="backgroundForSVG" style={{marginBottom:7, marginTop: 3, marginRight: 7}}>
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