import { React } from "react";
import { Row, Col, Card, Tabs, Radio, Space } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

import Avatar from "../componentsForTabs/Avatar";
import Cancel from "../componentsForTabs/Cancel";
import ButtonText from "../componentsForTabs/ButtonText";
export default function MobileAccountTab() {
  const screens = useBreakpoint();
  console.log(screens)
  const title = {
    fontSize: "20px",
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
    marginTop: 10,
    border: "none",
  };
  return (
    <Row style={{height: "100%"}}>
      <Col span={24}>
        <Row>
          <Col
            xs={24}
            sm={24}
            style={{ marginTop: "10px", paddingLeft: "5px" }}
          >
            <span style={title}>Username</span>
          </Col>
          <Col xs={15} sm={19}>
            <input style={input}></input>
          </Col>
        </Row>
        <Row>
          <Col
            xs={24}
            sm={24}
            style={{ marginTop: "20px", paddingLeft: "5px" }}
          >
            <span style={title}>Password</span>
          </Col>
          <Col xs={15} sm={19}>
            <input style={input}></input>
          </Col>
        </Row>
        <Row style={{ marginTop: 30 }}>
          <Col xs={6} sm={7}>
            <Cancel height="120%" />
          </Col>
          <Col xs={6} sm={7} style={{ marginLeft: 30 }}>
            <ButtonText text="UPDATE" height="120%" />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
