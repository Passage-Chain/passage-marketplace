import { React } from "react";
import { Row, Col, Card, Tabs, Radio, Space, Select, Slider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { setAudioVolume } from "../../../../redux/appSlice";
import { setSettingsTabDefault } from "../../../../redux/accountSlice";

export default function AudioTab() {
  const app = useSelector((state) => state.app);

  const dispatch = useDispatch();
  const [audioState, setaudioState] = useState(app.audioVolume);
  const localVideoDevices = app.videoDevices;
  const localAudioDevices = app.audioDevices;
  const { Option } = Select;

  useEffect(() => {
    dispatch(setSettingsTabDefault("2"));
  }, []);

  const [localSelectedVideoDevice, setLocalSelectedVideoDevice] = useState(
    app.selectedVideoDevice
  );
  const [localSelectedAudioDevice, setLocalSelectedAudioDevice] = useState(
    app.selectedAudioDevice
  );

  const title = {
    fontFamily: "Montserrat",
    color: "#FFFFFF",
    fontSize: "19px",
  };
  const advice = {
    color: "#909090",
    fontSize: "12px",
    fontFamily: "Montserrat",
  };
  const dropdown = {
    borderRadius: "20px",
    background: "#7F7F7F",
    color: "#FFFFFF",
  };
  const select = {
    width: "90%",
    height: "90%",
  };
  const sliderValue = {
    color: "#909090",
    fontSize: "14px",
    fontFamily: "Montserrat",
    marginLeft: "15px",
    marginTop: "20px",
  };
  function handleAudioChange(value) {
    setaudioState(value);
    dispatch(setAudioVolume(value));
  }

  return (
    <Row>
      <Col span={24}>
        <Row>
          <Col span={24} style={{ marginTop: 20 }}>
            <span style={title}>Microphone</span>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginTop: "8px" }}>
            <span style={advice}>Select microphone device.</span>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginTop: 20 }}>
            <Select
              style={select}
              suffixIcon="▼"
              placeholder="Select microphone device."
              dropdownStyle={dropdown}
              onChange={(value) => setLocalSelectedAudioDevice(value)}
            >
              {localAudioDevices.map((item) => (
                <Option key={item.id}>{item.label}</Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginTop: "4px" }}>
            <span style={title}>Audio</span>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginTop: "10px" }}>
            <span style={advice}>Select audio device.</span>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginTop: 20 }}>
            <Select
              style={select}
              suffixIcon="▼"
              placeholder="Headphones"
              dropdownStyle={dropdown}
            ></Select>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginTop: "10px" }}>
            <span style={advice}>Audio level.</span>
          </Col>
          <Col span={19} style={{ marginTop: "15px" }}>
            <Slider value={audioState} onChange={handleAudioChange}></Slider>
          </Col>
          <Col span={1} style={sliderValue}>
            <span>{audioState}</span>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
