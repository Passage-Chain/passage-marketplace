import { React } from "react";
import { Row, Col, Card, Tabs, Radio, Space } from "antd";

import { ReactSVG } from "react-svg";

import FriendsWithoutBackground from "../../../assets/images/FriendsWithoutBackround.svg";
import { Switch, Route, useHistory, useRouteMatch } from "react-router-dom";

import SettingHeaderPanel from "./SettingHeaderPanel";
import MobileAccountTab from "./Tabs/MobileTabs/MobileAccountTab";
import AudioTab from "./Tabs/AudioTab";
import VideoTab from "./Tabs/VideoTab";
import BillingTab from "./Tabs/BillingTab";
import ConnectionTab from "./Tabs/ConnectionTab";
import PrivacyTab from "./Tabs/PrivacyTab";
import { setSettingsTabDefault } from "../../../redux/accountSlice";
import { useDispatch, useSelector } from "react-redux";

const { TabPane } = Tabs;

export default function MobileSettingsPanel() {
  const account = useSelector((state) => state.account);
  const tabDefault = account.settingsTabDefault;
  const history = useHistory();
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
          <Col>
            <Card
              style={{
                width: "100vw",
                boxShadow: "2px",
                border: 0,
                backgroundColor: "#282828",
                borderRadius: 10,
                color: "white",
              }}
              
            >
              {/* Header */}
              <SettingHeaderPanel
                onExitSettings={() => {
                  history.push("/app/index");
                }}
              />
              <Tabs
                tabPosition={"left"}
                style={{ height: "89vh" }}
                defaultActiveKey={tabDefault}
                id="mobile-fix-tabs-container"
              >
                <TabPane tab="ACCOUNT" key="1">
                  <div
                    style={{
                      width: "70vw",
                      height: "80vh",
                      overflowY: "scroll",
                      overflowX: "hidden",
                      
                    }}
                    id="mobile-fix-tab"
                  >
                    <Row>
                      <Col span={24} id="mobile-fix-tab">
                        <MobileAccountTab />
                      </Col>
                    </Row>
                  </div>
                </TabPane>
                <TabPane tab="AUDIO" key="2">
                  <div
                    style={{
                      width: "70vw",
                      height: "80vh",
                      overflowY: "scroll",
                      overflowX: "hidden",
                    }}
                    id="mobile-fix-tab"
                  >
                    <Row>
                      <Col span={24}>
                        <AudioTab />
                      </Col>
                    </Row>
                  </div>
                </TabPane>
                <TabPane tab="VIDEO" key="3">
                  <div
                    style={{
                      width: "70vw",
                      height: "80vh",
                      overflowY: "scroll",
                      overflowX: "hidden",
                    }}
                    id="mobile-fix-tab"
                  >
                    <Row>
                      <Col span={24}>
                        <VideoTab />
                      </Col>
                    </Row>
                  </div>
                </TabPane>
                <TabPane tab="BILLING" key="4">
                  <div
                    style={{
                      width: "70vw",
                      height: "80vh",
                      overflowY: "scroll",
                      overflowX: "hidden",
                    }}
                    id="mobile-fix-tab"
                  >
                    <Row>
                      <Col span={24}>
                        <BillingTab />
                      </Col>
                    </Row>
                  </div>
                </TabPane>
                <TabPane tab="CONNECTIONS" key="5">
                  <div
                    style={{
                      width: "70vw",
                      height: "80vh",
                      overflowY: "scroll",
                      overflowX: "hidden",
                    }}
                    id="mobile-fix-tab"
                  >
                    <Row>
                      <Col span={24}>
                        <ConnectionTab />
                      </Col>
                    </Row>
                  </div>
                </TabPane>
                <TabPane tab="PRIVACY" key="6">
                  <div
                    style={{
                      width: "70vw",
                      height: "80vh",
                      overflowY: "scroll",
                      overflowX: "hidden",
                    }}
                    id="mobile-fix-tab"
                  >
                    <Row>
                      <Col span={24}>
                        <PrivacyTab />
                      </Col>
                    </Row>
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
