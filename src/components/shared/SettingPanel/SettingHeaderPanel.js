import { React } from "react";

import { Row, Col } from "antd";

import { ReactSVG } from "react-svg";

import Settings from "../../../assets/images/settings.svg";
import close from "../../../assets/images/close_btn (Hover State).svg";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { setSettingsTabDefault } from "../../../redux/accountSlice";

export default function SettingHeaderPanel({ onExitSettings }) {
  const dispatch = useDispatch()
  function setDefaultTab() {
    dispatch(setSettingsTabDefault("1"))
  }
  return (
    <Row
      style={{ borderBottom: "1px solid #2e2e2e"}}
      justify={"space-between"}
    >
      <Col>
        <Row style={{ padding: 12, paddingBottom: 6, alignContent: "center" }}>
          <Col>
            <ReactSVG src={Settings}></ReactSVG>
          </Col>
          <Col style={{ marginLeft: 16 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                letterSpacing: 0,
                fontSize: 19,
                fontFamily: "Niveau Grotesk Bold",
              }}
            >
              SETTINGS
            </span>
          </Col>
        </Row>
      </Col>
      <Col style={{ marginTop: 5, marginRight: 10 }}>
        <Row justify={"end"}>
          <div className="backgroundForSVG" onClick={onExitSettings}>
            <ReactSVG src={close} onClick={setDefaultTab}></ReactSVG>
          </div>
        </Row>
      </Col>
    </Row>
  );
}
