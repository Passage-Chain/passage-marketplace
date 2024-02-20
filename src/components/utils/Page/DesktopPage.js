import React, { Component } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Layout } from "antd";

import "./../../../styles/style.css";

import { Switch, Route, useHistory, useRouteMatch } from "react-router-dom";

import { useState, useEffect } from "react";
import agora from "../../../services/agora";
import leftMenuSetting from "../../../assets/images/left_menu_icon1.svg";
import leftMenuIcon2 from "../../../assets/images/left_menu_icon2.svg";
import leftMenuIcon3 from "../../../assets/images/left_menu_icon3.svg";
import leftMenuPassgeLogo from "../../../assets/images/left_menu_passageLogo.svg";
import settingBg from "../../../assets/images/setting_bg.svg";
import message_chat from "../../../assets/images/message_chat.svg";
import favorite_exp from "../../../assets/images/favorite_Experiences.svg";
import { ReactSVG } from "react-svg";
import PublicProfile from "../../Settings/PublicProfile";
import Account from "../../Settings/Account";
import Media from "../../Settings/Media";
import Notification from "../../Settings/Notification";
import UserDetails from "../../../components/custom/UserDetails";
import SocialFeed from "../../Feed/SocialFeed";
import SimilarGames from "../../SimilarGames/SimilarGames";
import Social from "../../Social-v2";

const { Header, Footer, Sider, Content } = Layout;

function DesktopPage() {
  const [collapsed, setCollapsed] = useState(true);

  const items = [
    { key: 1, icon: leftMenuSetting, children: [], label: "Settings" },
    { key: 2, icon: leftMenuIcon2, children: [], label: "SocialFeed" },
    { key: 2, icon: leftMenuIcon2, children: [], label: "SocialFeed" },
    { key: 3, icon: leftMenuIcon3, children: [], label: "leftMenu3" },
  ];
  const settingItems = [
    { key: 1, icon: leftMenuSetting, children: [], label: "Public profile" },
    { key: 2, icon: leftMenuSetting, children: [], label: "Account settings" },
    { key: 3, icon: leftMenuSetting, children: [], label: "Audio and Video" },
    { key: 4, icon: leftMenuSetting, children: [], label: "Notifications" },
    { key: 5, icon: leftMenuSetting, children: [], label: "Wallet" },
  ];
  const [active, setActive] = useState("");
  const [isChildSettingMenu, setChildMenu] = useState("Public profile");

  const history = useHistory();
  const dispatch = useDispatch();
  const app = useSelector((state) => state.app);

  function enableMic() {
    agora.updateStateAudioTrack(false);
  }

  function disableMic() {
    agora.updateStateAudioTrack(true);
  }

  const gotoWorld = () => {
    history.push("/app/index/world");
  };

  return (
    <>
      <Layout
        style={{
          height: "100vh",
          padding: 0,
          backgroundImage: `url(${settingBg})`,
          backgroundRepeat: "no-repeat",
          "overflow-y": "scroll",
          backgroundSize: "100%",
        }}
      >
        <Sider
          className="background-none"
          collapsible={false}
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <Row style={{ textAlign: "center", marginTop: "20px" }}>
            <Col span={25} className="header">
              <ReactSVG src={leftMenuPassgeLogo}></ReactSVG>
            </Col>
            <Col span={15}>
              <div className="menu">
                {items.map((e) => {
                  return (
                    <div>
                      <div
                        key={e.key}
                        className={`leftmenudiv ${
                          active === e.label ? "left-menu-active" : ""
                        }`}
                        onClick={() => setActive(e.label)}
                      >
                        <ReactSVG src={e.icon}></ReactSVG>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Col>
            <Col span={15}>
              <div className="chat">
                <div className="chaticondiv2">
                  <ReactSVG className="chatimg" src={message_chat}></ReactSVG>
                </div>
              </div>
            </Col>
          </Row>
        </Sider>
        {active === "Settings" && (
          <Sider
            className="background-none"
            style={{ display: "inline-block", height: "100%" }}
          >
            <Row
              style={{
                textAlign: "left",
                marginTop: "100px",
                display: "inline-block",
              }}
            >
              <Col span={24}>
                <h2 className="setting-header">Settings</h2>
              </Col>
              {settingItems.map((e) => {
                return (
                  <Col span={24} key={e.label}>
                    <div
                      className={`setting-button ${
                        isChildSettingMenu === e.label
                          ? "setting-button-active"
                          : "setting-button-hover"
                      }`}
                      onClick={() => setChildMenu(e.label)}
                    >
                      {e.label}
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Sider>
        )}

        <Layout style={{ background: "none" }} className="layout">
          <Header
            className="fav_exp"
            style={{
              textAlign: "right",
              background: "none",
              paddingTop: "10px",
              paddingRight: "80px",
            }}
          >
            <ReactSVG
              src={favorite_exp}
              style={{ display: "inline-block", paddingRight: "20px" }}
              onClick={gotoWorld}
            />
            <UserDetails />
          </Header>
          <Layout style={{ background: "none" }} className="layout">
            <Content style={{ background: "none", width: "70%" }}>
              {active === "Settings" && (
                <>
                  {isChildSettingMenu === "Public profile" && <PublicProfile />}
                  {isChildSettingMenu === "Account settings" && <Account />}
                  {isChildSettingMenu === "Audio and Video" && <Media />}
                  {isChildSettingMenu === "Notifications" && <Notification />}
                  {/* { isChildSettingMenu === "Wallet" && <Wallet />} */}
                </>
              )}
              {active === "SocialFeed" && (
                <>
                  <SocialFeed />
                </>
              )}
              <SimilarGames></SimilarGames>
            </Content>
            <Social />
          </Layout>
        </Layout>
      </Layout>
    </>
  );
}

export default DesktopPage;
