import { React } from "react";
import { Row, Col, Card, Tabs, Radio, Space } from "antd";

export default function Change(props) {
  const text = {
    fontFamily: "Niveau Grotesk Bold",
    color: "#FFFFFF",
  };
  const change = {
    background: "#606060",
    borderRadius: "20px",
    width: "100%",
    border: "2px  solid #707070",
    textAlign: "center",
    height: props.height,
    paddingTop: "7px",
  };
  return (
    <div style={change}>
      <span style={text}>{props.text}</span>
    </div>
  );
}
