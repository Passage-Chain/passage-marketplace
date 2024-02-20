import { React } from "react";
import { Row, Col, Checkbox } from "antd";
import { ReactSVG } from "react-svg";
import {
  setIsHarassment,
  setIsSuspicious,
  setIsAbusive,
  setIsIllegal,
  setIsSolicting,
} from "../../../../redux/reportSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";

export default function Checkboxes(params) {
  const report = useSelector((state) => state.report);
  const dispatch = useDispatch();
  const checkboxText = {
    color: "#FFFFFF",
    fontSize: "14px",
    fontFamily: "Montserrat",
  };
  function causeReport(e, type) {
    const checked = e.target.checked;
    console.log(checked);
    if (type === "harassment") {
      dispatch(setIsHarassment(checked));
    }
    if (type === "suspicious") {
      dispatch(setIsSuspicious(checked));
    }
    if (type === "abusive") {
      dispatch(setIsAbusive(checked));
    }
    if (type === "illegal") {
      dispatch(setIsIllegal(checked));
    }
    if (type === "solicting") {
      dispatch(setIsSolicting(checked));
    }
  }
  return (
    <Row>
      <Col span={24}>
        <Row>
          <Col span={24} style={{ marginTop: 20 }}>
            <Checkbox
              checked={report.harassment}
              onChange={(e) => causeReport(e, "harassment")}
            >
              <span style={checkboxText}>Harassment</span>
            </Checkbox>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginTop: 5 }}>
            <Checkbox
              checked={report.suspicious}
              onChange={(e) => causeReport(e, "suspicious")}
            >
              <span style={checkboxText}>Suspicious behavior or spam</span>
            </Checkbox>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginTop: 5 }}>
            <Checkbox
              checked={report.solicting}
              onChange={(e) => causeReport(e, "solicting")}
            >
              <span style={checkboxText}>Soliciting other users</span>
            </Checkbox>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginTop: 5 }}>
            <Checkbox
              checked={report.abusive}
              onChange={(e) => causeReport(e, "abusive")}
            >
              <span style={checkboxText}>Using abusive language</span>
            </Checkbox>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginTop: 5 }}>
            <Checkbox
              checked={report.illegal}
              onChange={(e) => causeReport(e, "illegal")}
            >
              <span style={checkboxText}>Illegal activity</span>
            </Checkbox>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
