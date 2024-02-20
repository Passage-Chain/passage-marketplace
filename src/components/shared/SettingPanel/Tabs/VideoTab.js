import { React } from "react";
import { Row, Col, Select, Checkbox } from "antd";
import VideoPreview from "./componentsForTabs/VideoPreview";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { setSettingsTabDefault } from "../../../../redux/accountSlice";
import { setSelectedVideoDevice } from "../../../../redux/appSlice";
import agora from "../../../../services/agora";

export default function VideoTab() {
  const { Option } = Select;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSettingsTabDefault("3"));
  }, []);
  const app = useSelector((state) => state.app);
  const localVideoDevices = app.videoDevices;
  const [localSelectedVideoDevice, setLocalSelectedVideoDevice] = useState(
    app.selectedVideoDevice
  );
  const advice = {
    color: "#909090",
    fontSize: "12px",
    fontFamily: "Montserrat",
  };
  const title = {
    fontFamily: "Montserrat",
    color: "#FFFFFF",
    fontSize: "19px",
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

  function handleVideoChange(value) {
    setLocalSelectedVideoDevice(value);
    dispatch(setSelectedVideoDevice(value));
    agora.setVideoDevice(value);
  }
  return (
    <Row>
      <Col span={24}>
        <Row>
          <Col span={24} style={{ marginTop: 20 }}>
            <VideoPreview />
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginTop: 15 }}>
            <span style={advice}>Select video device.</span>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginTop: 10 }}>
            <span style={title}>Video</span>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginTop: 20 }}>
            <Select
              style={select}
              suffixIcon="▼"
              placeholder="SELECT VIDEO DEVICE"
              dropdownStyle={dropdown}
              value={localSelectedVideoDevice}
              onChange={(value) => handleVideoChange(value)}
            >
              {localVideoDevices.map((item) => (
                <Option key={item.id}>{item.label}</Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginTop: 15, marginLeft: 10 }}>
            <Checkbox>
              <span style={advice}>
                Automatically turn off video feed when not focused on browser{" "}
              </span>
            </Checkbox>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
