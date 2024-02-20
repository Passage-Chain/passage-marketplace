import { React } from "react";
import { Row, Col, Card, Tabs, Radio, Space } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { setSettingsTabDefault } from "../../../../redux/accountSlice";
export default function BillingTab() {

  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(setSettingsTabDefault("4"));
  }, []); 

  const title = {
    fontSize: "19px",
    fontFamily: "Montserrat",
    color: "#FFFFFF",
    marginTop: "19px",
  };
  const cancel = {
    background: "transparent",
    borderRadius: "20px",
    width: "100%",
    border: "2px solid #707070",
    textAlign: "center",
    color: "white",
    fontFamily: "Niveau Grotesk Bold",
    fontSize: "20px",
    padding: "5px 0 2px 0",
    marginTop: "8px",
  };
  const update = {
    background: "#606060",
    borderRadius: "20px",
    width: "100%",
    textAlign: "center",
    color: "white",
    fontFamily: "Niveau Grotesk Bold",
    fontSize: "20px",
    padding: "5px 0 2px 0",
    marginTop: "8px",
  };
  return (
    <Row>
      <Col span={21}>
        <Row>
          <Col span={24} style={title}>
            Account Billing
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
            Set up and manage your account billing for two click purchasing.
          </Col>
          <Col span={24}>
            <input
              className="auth-input"
              type="text"
              placeholder="Name on card"
              style={{ marginTop: "16px", width: "100%" }}
            ></input>
          </Col>
          <Col span={24}>
            <input
              className="auth-input"
              type="text"
              placeholder="Card number"
              style={{ width: "100%" }}
            ></input>
          </Col>
          <Col span={24}>
            <input
              className="auth-input"
              type="text"
              placeholder="Billing Adress"
              style={{ width: "100%" }}
            ></input>
          </Col>
          <Col span={24}>
            <Row justify="space-between">
              <Col span={11} style={cancel}>
                CANCEL
              </Col>
              <Col span={11} style={update}>
                UPDATE
              </Col>
            </Row>
          </Col>
          <Col
            span={24}
            style={{
              fontSize: "19px",
              fontFamily: "Montserrat",
              color: "#FFFFFF",
              marginTop: "12px",
            }}
          >
            Purchases
          </Col>
          <Col span={24} style={{ marginTop: "12px" }}>
            <Checkbox
              style={{
                fontFamily: "Montserrat",
                fontSize: "14px",
                color: "#909090",
              }}
            >
              Enable two-click purchasing from event vendors.
            </Checkbox>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
