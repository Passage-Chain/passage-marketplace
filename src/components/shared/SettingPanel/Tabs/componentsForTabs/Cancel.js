import { React } from "react";
import { Row, Col, Card, Tabs, Radio, Space } from "antd";
import { OmitProps } from "antd/lib/transfer/ListBody";

export default function Cancel(props) {
  const cancel = {
    background: "transparent",
    borderRadius: "20px",
    width: "100%",
    border: "2px  solid #707070",
    textAlign: "center",
    height: props.height,
    paddingTop: "7px",
  };
  const text = {
    fontFamily: "Niveau Grotesk Bold",
    color: "#FFFFFF",
  };
  return (
    <div style={cancel}>
      <span style={text}>CANCEL</span>
    </div>
  );
}
