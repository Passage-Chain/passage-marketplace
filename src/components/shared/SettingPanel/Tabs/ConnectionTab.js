import { React } from "react";
import { Row, Col, Card, Tabs, Radio, Space, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { setSettingsTabDefault } from "../../../../redux/accountSlice";

export default function ConnectionTab() {
  const { Option } = Select;
  const dispatch = useDispatch();
  const app = useSelector((state) => state.app);
  const [audioState, setaudioState] = useState(app.audioVolume);
  const localVideoDevices = app.videoDevices;
  const localAudioDevices = app.audioDevices;
  useEffect(() => {
    dispatch(setSettingsTabDefault("5"));
  }, []);
  const [localSelectedVideoDevice, setLocalSelectedVideoDevice] = useState(
    app.selectedVideoDevice
  );
  const title = {
    fontSize: "19px",
    fontFamily: "Montserrat",
    color: "#FFFFFF",
    marginTop: "19px",
    fontStretch: "expanded",
  };
  const disconnect = {
    background: "#606060",
    padding: "7px",
    borderRadius: "24px",
    width: "100%",
    textAlign: "center",
    color: "white",
    fontFamily: "Niveau Grotesk Bold",
    fontSize: "19px",
    boxShadow: "0px 4px 0px #4F4F4F",
  };
  const dropdown = {
    borderRadius: "20px",
    background: "#7F7F7F",
    color: "#FFFFFF",
  };
  const select = {
    width: "100%",
    height: "90%",
  };
  return (
    <Row>
      <Col span={21}>
        <Row>
          <Col span={24} style={title}>
            Social Connections
          </Col>
          <Col
            span={24}
            style={{
              color: "#909090",
              fontFamily: "Montserrat",
              fontSize: "14px",
              marginTop: "10px",
            }}
          >
            Select video device.
          </Col>
          <Col span={24} style={{ marginTop: "16px" }}>
            <Select
              style={select}
              suffixIcon="▽"
              placeholder="Select video device"
              dropdownStyle={dropdown}
              onChange={(value) => setLocalSelectedVideoDevice(value)}
            >
              {localVideoDevices.map((item) => (
                <Option key={item.id}>{item.label}</Option>
              ))}
            </Select>
          </Col>
          <Col span={24} style={{ marginTop: "16px" }}>
            <Row justify="space-between" align="middle">
              {/* <Col span={16}>
                <button
                  className="auth-button"
                  style={{
                    backgroundColor: "#1E90FF",
                    boxShadow: "0px 4px 0px #1755a4",
                    width: "100%",
                    padding: "7px",
                    margin: 0,
                  }}
                >
                  LOGGED IN WITH FACEBOOK
                </button>
              </Col>
              <Col span={7} style={disconnect}>
                DISCONNECT
              </Col> */}
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
