import { React, useEffect, useState } from "react";
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

import useDevices from "../../hooks/useDevices";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import accountHttpService from "../../services/account";
import { setLogin as setReduxLogin, setToken } from "../../redux/accountSlice";

const { Option } = Select;
export default function InitialSetup() {
  const title = {
    color: "#FFFFFF",
    fontSize: "19px",
    fontFamily: "Niveau Grotesk Bold",
  };
  const text = {
    color: "#909090",
    fontSize: "14px",
    fontFamily: "Montserrat",
  };
  const advice = {
    color: "#909090",
    fontSize: "12px",
    fontFamily: "Montserrat",
    textAlign: "center",
  };
  const select = {
    width: "80%",
    height: "48px",
  };
  const dropdown = {
    borderRadius: "20px",
    background: "#7F7F7F",
    color: "#FFFFFF",
  };
  const { Option } = Select;

  useDevices();

  const app = useSelector((state) => state.app);
  const localVideoDevices = app.videoDevices;
  const localAudioDevices = app.audioDevices;

  const history = useHistory();

  const [localSelectedVideoDevice, setLocalSelectedVideoDevice] = useState(
    app.selectedVideoDevice
  );
  const [localSelectedAudioDevice, setLocalSelectedAudioDevice] = useState(
    app.selectedAudioDevice
  );

  function finishPressed() {
    history.push("/app");
  }

  useEffect(() => {
    setLocalSelectedVideoDevice(app.selectedVideoDevice);
    setLocalSelectedAudioDevice(app.selectedAudioDevice);
  }, [app.selectedVideoDevice, app.selectedAudioDevice]);

  return (
    <Row justify={"center"}>
      <Col span={24}>
        <Row justify={"center"}>
          <Col
            span={24}
            style={{
              background: "#282828",
              maxWidth: 390,
              minWidth: 350,
              borderRadius: "15px",
            }}
          >
            <Row>
              <Col span={24} style={{ textAlign: "center", marginTop: 30 }}>
                <span style={title}>Initial Setup</span>
              </Col>
              <Col span={24} style={{ textAlign: "center", marginTop: 15 }}>
                <span style={text}>Select audio/video devices below.</span>
              </Col>
            </Row>
            <Row justify={"center"}>
              <Col
                span={24}
                style={{ textAlign: "center", alignContent: "center" }}
              >
                <Row justify={"center"}>
                  <Col span={24} style={{ marginTop: 10 }}>
                    <Select
                      style={select}
                      suffixIcon="▼"
                      placeholder="SELECT MICROPHONE"
                      dropdownStyle={dropdown}
                      value={localSelectedAudioDevice}
                      onChange={(value) => setLocalSelectedAudioDevice(value)}
                    >
                      {localAudioDevices.map((item) => (
                        <Option key={item.id}>{item.label}</Option>
                      ))}
                    </Select>
                  </Col>
                  <Col
                    span={24}
                    style={{
                      marginTop: 20,
                      textAlign: "center",
                      alignContent: "center",
                    }}
                  >
                    <Select
                      style={select}
                      suffixIcon="▼"
                      placeholder="SELECT WEBCAM"
                      dropdownStyle={dropdown}
                      value={localSelectedVideoDevice}
                      onChange={(value) => setLocalSelectedVideoDevice(value)}
                    >
                      {localVideoDevices.map((item) => (
                        <Option key={item.id}>{item.label}</Option>
                      ))}
                    </Select>
                  </Col>
                  <Col
                    span={24}
                    style={{
                      marginTop: 20,
                      textAlign: "center",
                      alignContent: "center",
                    }}
                  >
                    <Select
                      style={select}
                      suffixIcon="▼"
                      placeholder="SELECT AUDIO"
                      dropdownStyle={dropdown}
                    ></Select>
                  </Col>
                  <Col
                    span={24}
                    style={{
                      marginTop: 20,
                      textAlign: "center",
                      alignContent: "center",
                    }}
                  >
                    <button
                      className="auth-button"
                      style={{
                        marginBottom: "40px",
                        width: "80%",
                        height: "48px",
                        fontSize:"19px"
                      }}
                      onClick={() => {
                        finishPressed();
                      }}
                    >
                      FINISH
                    </button>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row justify={"center"}>
              <Col
                span={18}
                style={{
                  marginBottom: 30,
                  marginTop: 10,
                  textAlign: "center",
                  alignContent: "center",
                }}
              >
                <span style={advice} > 
                  Visit the settings menu to check or change audio/video
                  settings at any time.
                </span>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
