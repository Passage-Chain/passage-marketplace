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
} from "antd";
import { ReactSVG } from "react-svg";
import MassagesWithoutBackground from "../../assets/images/MassagesWithoutBackground.svg";
import CloseButton from "../../assets/images/close_btn (Hover State).svg";

export default function MobileUsersForMessages({
  onMassagesClick,
  onExitMassagesClick,
}) {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  console.log(screens);
  const Messages = {
    fontFamily: "Niveau Grotesk Bold",
    color: "#ffff",
    fontSize: "19px",
  };
  return (
    <Row style={{ paddingBottom: 10 }}>
      <Col xs={24} sm={24} md={24} lg={24}>
        <Row>
          <Col
            xs={2}
            sm={2}
            md={2}
            lg={2}
            style={{ marginLeft: 20, marginTop: 10 }}
          >
            <ReactSVG src={MassagesWithoutBackground}></ReactSVG>
          </Col>
          <Col xs={19} sm={19} md={19} lg={20} style={{ marginTop: 15 }}>
            <span style={Messages}>MESSAGES</span>
          </Col>
          <Col
            xs={1}
            sm={1}
            md={1}
            lg={1}
            style={
              screens.md ? { marginTop: 9, marginLeft: 10 } : { marginTop: 9 }
            }
            onClick={onExitMassagesClick}
          >
            <div className="backgroundForSVG">
              <ReactSVG src={CloseButton}></ReactSVG>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
