import { React, useEffect, useState } from "react";
import { Card, Row, Col } from "antd";
import { ReactSVG } from "react-svg";

import FriendsTable from "./FriendsTable";

import FriendNavigationPanel from "./FriendNavigationPanel";
import accountHttpService from "../../../services/account";
import {
  setLogin as setReduxLogin,
  setToken,
} from "../../../redux/accountSlice";
import { useDispatch, useSelector } from "react-redux";
export default function DesktopFriendsPanel({
  onExitFriendsClick,
  isLoading,
  setLoading,
}) {
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 50);
  });
  return (
    <Row
      align={"center"}
      justify={"center"}
      style={{ height: "100%", pointerEvents: "auto" }}
    >
      <Col span={24}>
        <Row
          justify={"center"}
          style={{ alignContent: "center", height: "100%" }}
        >
          <Card
            style={{
              width: 800,
              boxShadow: "2px",
              height: "70vh",
              border: 0,
              backgroundColor: "#282828",
              borderRadius: 10,
              color: "white",
            }}
          >
            {/* Header */}
            <Row>
              <Col span={24}>
                <FriendNavigationPanel
                  onExitFriendsClick={onExitFriendsClick}
                />
                <Row style={{ overflowY: "scroll" }}>
                  <Col span={24}>
                    <FriendsTable />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Row>
      </Col>
    </Row>
  );
}
