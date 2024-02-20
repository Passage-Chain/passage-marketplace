import { React } from "react";
import { Row, Col, Checkbox, Input } from "antd";
import { ReactSVG } from "react-svg";
import close from "../../../../../assets/images/close_btn (Hover State).svg";
import Checkboxes from "../Chekboxes";
import Submit from "../Submit";
import { useState, useEffect } from "react";
import ReportSubmitted from "../ReportSubmitted";
import { useDispatch, useSelector } from "react-redux";
import accountHttpService from "../../../../../services/account";
import Toast from '../../../../custom/CustomToast';
import { useHistory } from 'react-router-dom';
import {
  setIsHarassment,
  setIsSuspicious,
  setIsAbusive,
  setIsIllegal,
  setIsSolicting,
  setIsReportOpen,
  setIsReportSubmited
} from "../../../../../redux/reportSlice";

export default function MobileReport(props) {
  const [reportDescription, setReportDescription] = useState("");
  const { TextArea } = Input;
  const [isSubmit, setIsSubmit] = useState(false);
  const [isEmptyReport, setIsEmptyReport] = useState(false);
  const account = useSelector((state) => state.account);
  const reportStatus = useSelector((state) => state.report);
  const history = useHistory
  const dispatch = useDispatch();

  function descriptionChange(e) {
    setReportDescription(e.target.value);
  }

  function checkIsReportEmpty(params) {
    if (
      reportStatus.harassment === false &&
      reportStatus.suspicious === false &&
      reportStatus.abusive === false &&
      reportStatus.illegal === false &&
      reportStatus.solicting === false /* && 
      reportDescription === "" */
    ) {
      setIsEmptyReport(true);
    } else {
      setIsEmptyReport(false);
    }
  }

  useEffect(() => {
    checkIsReportEmpty();
  }, [reportStatus]);

  useEffect(() => {
    checkIsReportEmpty();
  },[]);

  function concatCauses() {
    let cause = "";
    if (reportStatus.harassment) {
      cause += "Harassment ";
    }
    if (reportStatus.suspicious) {
      cause += "Suspicious_behavior_or_spam ";
    }
    if (reportStatus.abusive) {
      cause += "Using_abusive_language ";
    }
    if (reportStatus.illegal) {
      cause += "Illegal_activity ";
    }
    if (reportStatus.solicting) {
      cause += "Soliciting_other_users ";
    }
    clearReportCheckboxes();
    return cause;
  }
  function clearReportCheckboxes() {
    dispatch(setIsHarassment(false));
    dispatch(setIsSuspicious(false));
    dispatch(setIsIllegal(false));
    dispatch(setIsAbusive(false));
    dispatch(setIsSolicting(false));
  }

  function submit() {
    if (isSubmit) {
      setIsSubmit(false);
    } else {
      setIsSubmit(true);
      dispatch(setIsReportSubmited(true))
    }
    const cause = concatCauses();
    const acused = props.whoReported;
    accountHttpService
      .addReport(account.token, acused, cause, reportDescription)
      .then((res) => {
        const data = res;
        console.log(data);
      })
      .catch((error) => {
        Toast.error('error', error.response.data.message);
        
      });
  }

  const report = {
    color: "#FFFFFF",
    fontFamily: "Niveau Grotesk Bold",
    fontSize: "19px",
  };
  const advice = {
    color: "#909090",
    fontSize: "12px",
    fontFamily: "Montserrat",
  };
  const info = {
    color: "#FFFFFF",
    fontSize: "19px",
    fontFamily: "Niveau Grotesk Bold",
  };
  const input = {
    borderRadius: "20px",
    background: "#040206",
    color: "#FFFFFF",
    fontSize: "16px",
    fontFamily: "Montserrat",
    paddingLeft: "10px",
    width: "85%",
    height: "85%",
    paddingBottom: "50%",
  };
  const textarea = {
    borderRadius: "20px",
    background: "#040206",
    color: "#FFFFFF",
    fontFamily: "Montserrat",
    border: "none",
    outline: "none",
    paddingTop: "10px",
    paddingLeft: "10px",
    paddingRight: "10px",
  };
  function changeStateReport() {
    dispatch(setIsReportOpen(false));
  }
  return (
    <div>
      {!isSubmit ? (
        <Row
          align={"center"}
          justify={"center"}
          style={{
            height: "100%",
            backgroundColor: "gray",
            pointerEvents: "auto",
            overflowY: "scroll",
          }}
          id="mobile-fix-report"
        >
          <Col span={24}>
            <Row
              style={{
                border: "1px solid black",
                width: "98vw",
                border: 0,
                backgroundColor: "#282828",
                borderRadius: 10,
              }}
            >
              <Col span={24} style={{ marginLeft: 0 }}>
                <Row style={{ paddingLeft: "30px" }}>
                  <Col xs={21} sm={22} style={{ marginTop: 30 }}>
                    <span style={report}>Report {props.reportedUserName}</span>
                  </Col>
                  <Col
                    sm={1}
                    style={{ marginTop: 10 }}
                    onClick={props.onExitReport}
                    className="opacity"
                  >
                    <div
                      className="backgroundForSVG"
                      onClick={changeStateReport}
                    >
                      <ReactSVG
                        src={close}
                        onClick={clearReportCheckboxes}
                      ></ReactSVG>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col span={20} style={{ padding: " 0 30px", marginTop: 10 }}>
                    <span style={advice}>
                      Select all the reasons why you are reporting this user.
                    </span>
                  </Col>
                </Row>

                <Row>
                  <Col span={24} style={{ padding: " 0 30px" }}>
                    <Checkboxes />
                  </Col>
                </Row>

                <Row>
                  <Col span={24} style={{ padding: " 0 30px", marginTop: 10 }}>
                    <span style={info}>Additional info</span>
                  </Col>
                </Row>

                <Row>
                  <Col
                    span={20}
                    style={{ paddingLeft: "30px", textAlign: "left" }}
                  >
                    <span style={advice}>
                      Please fill out the form below if you would like to add
                      any specifics to your report. The more info you provide,
                      the better we can make determinations on this specific
                      case.
                    </span>
                  </Col>
                </Row>

                <Row>
                  <Col
                    span={24}
                    style={{ padding: " 0 30px", marginTop: 15, marginLeft: 0 }}
                  >
                    <TextArea
                      style={textarea}
                      onChange={(e) => descriptionChange(e)}
                      rows="8"
                      placeholder="Type here..."
                    ></TextArea>
                  </Col>
                </Row>

                <Row>
                  <Col
                    span={24}
                    style={{
                      padding: " 0 30px",
                      marginLeft: 0,
                      marginBottom: 20,
                      marginTop: 10,
                    }}
                    onClick={isEmptyReport ? null : submit}
                  >
                    <Submit />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      ) : (
        <Row justify={"center"}>
          <Col xs={20} sm={15}>
            <ReportSubmitted
              onExitReport={props.onExitReport}
              reportedUserName={props.reportedUserName}
            />
          </Col>
        </Row>
      )}
    </div>
  );
}
