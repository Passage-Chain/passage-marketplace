import { auto } from "async";
import { ReactSVG } from "react-svg";
import React, { Component } from "react";
import { useState } from "react";
import customization from "../../../assets/images/customization_btn.svg";
import settings from "../../../assets/images/settings_btn.svg";
import friends from "../../../assets/images/friends_btn.svg";
import MenuButton from "../MenuButton/MenuButton";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  useHistory,
} from "react-router-dom";

function NavigationCircleButton() {
  const history = useHistory();

  const buttonNav = {
    float: "left",
    marginLeft: "5px",
    display: "inline-block",
  };

  function goToCustomization() {
    history.push("/app/customization");
  }

  function displayFriendsPanel() {
    history.push("/app/index/friends");
  }

  function displaySettingPanel() {
    history.push("/app/index/settings");
  }

  return (
    <div>
      {/*<div className="buttonNav" style={buttonNav} onClick={goToCustomization}>
        <MenuButton img={customization}></MenuButton>
  </div>*/}
      <div
        className="buttonNav"
        style={buttonNav}
        onClick={displayFriendsPanel}
      >
        <MenuButton img={friends}></MenuButton>
      </div>
      <div
        className="buttonNav"
        onClick={displaySettingPanel}
        style={buttonNav}
      >
        <MenuButton img={settings}></MenuButton>
      </div>
    </div>
  );
}
export default NavigationCircleButton;
