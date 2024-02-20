import { React } from "react";
import {
  Row,
  Col,
  Card,
  Tabs,
  Radio,
  Space,
  Select,
  Checkbox,
  Switch,
} from "antd";
// DELETE // import commandService from "../../../../services/commands";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { setSettingsTabDefault } from "../../../../redux/accountSlice";
import { setWASDControl, setTouchControl } from "../../../../redux/appSlice";
import GameInstance from "../../../../services/gameInstance";

export default function ControlsTab() {
  const dispatch = useDispatch();
  const app = useSelector((state) => state.app);

  const [WASD, setWASD] = useState(app.WASDControl);
  const [touch, setTouch] = useState(app.touchControl);

  useEffect(() => {
    dispatch(setSettingsTabDefault("7"));
  }, []);

  function setControlMode(mode) {
    const game = GameInstance.getInstance();
    game.setInputMode(mode);
    //commandService.createInputModeCommand(mode);
  }

  function handleSwitchChange(e, mode) {
    const checked = e;
    if (mode === "WASD") {
      setWASD(checked);
      dispatch(setWASDControl(checked));
      if (checked) {
        //setControlMode()
        setTouch(false);
        dispatch(setTouchControl(false));
      }
    }
    if (mode === "Touch") {
      setTouch(checked);
      dispatch(setTouchControl(checked));
      if (checked) {
        //setControlMode()
        setWASD(false);
        dispatch(setWASDControl(false));
      }
    }
  }

  const title = {
    fontSize: "19px",
    fontFamily: "Montserrat",
    color: "#FFFFFF",
    marginTop: "19px",
    fontStretch: "expanded",
  };

  const text = {
    color: "#909090",
    fontFamily: "Montserrat",
    fontSize: "14px",
    marginTop: "15px",
  };

  return (
    <Row>
      <Col span={21}>
        <Row>
          <Col span={24} style={title}>
            Choose the controls that are convenient for you
          </Col>
          <Col span={11} style={text}>
            Navigation on the WASD keys
          </Col>
          <Col span={2} style={text}>
            <Switch
              checked={WASD}
              onChange={(e) => handleSwitchChange(e, "WASD")}
            ></Switch>
          </Col>
        </Row>
        <Row>
          <Col span={8} style={text}>
            Navigation by touch
          </Col>
          <Col span={2} style={text}>
            <Switch
              checked={touch}
              onChange={(e) => handleSwitchChange(e, "Touch")}
            ></Switch>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
