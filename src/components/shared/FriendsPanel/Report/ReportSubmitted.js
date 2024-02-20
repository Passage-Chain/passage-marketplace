import { React } from "react";
import { Row, Col, Checkbox } from "antd";
import { ReactSVG } from "react-svg";
import close from "../../../../assets/images/close_btn (Hover State).svg";
import Checkboxes from "./Chekboxes";
import Submit from "./Submit";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsReportOpen, setIsReportSubmited } from "../../../../redux/reportSlice";

export default function ReportSubmitted(props) {
  const submitted = {
    color: "#FFFFFF",
    fontFamily: "Niveau Grotesk Bold",
    fontSize: "19px",
  };
  const advice = {
    color: "#DEDEDE",
    fontSize: "12px",
    fontFamily: "Montserrat",
  };
  const dispatch = useDispatch();

  function changeReportState() {
    dispatch(setIsReportOpen(false));
    dispatch(setIsReportSubmited(false))
  }
  return (
    <Row style={{ background: "#523FF9", borderRadius: "10px" }}>
      <Col span={24} style={{ marginLeft: 20 }}>
        <Row>
          <Col span={19} style={{ marginTop: 30 }}>
            <span style={submitted}>Report Submitted</span>
          </Col>
          <Col
            span={1}
            style={{ marginTop: 10, marginLeft: 10 }}
            onClick={props.onExitReport}
          >
            <div
              className="backgroundForSVG"
              style={{ boxShadow: "0 2px 0 0 #303030" }}
              onClick={changeReportState}
            >
              <ReactSVG src={close}></ReactSVG>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={20} style={{ marginRight: 20 }}>
            <span style={advice}>
              Your report on {props.reportedUserName} has been successfully
              submitted. A member of our team will review your case and take
              appropriate action if determined to be a legitimate cause for
              termination. A case number will be sent to your account email
              address for your reference.
            </span>
          </Col>
        </Row>
        <Row>
          <Col span={20} style={{ marginTop: 15, marginBottom: 20 }}>
            <span style={advice}>
              If you have any questions, don't hesitate to respond directly to
              the case number email. Otherwise, you can contact us at
              <a className="mail" href="mailto:info@passage.com">
                info@passage.com
              </a>
            </span>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
