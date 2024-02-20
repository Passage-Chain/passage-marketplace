import { auto } from "async";
import { ReactSVG } from "react-svg";
import React, { Component } from "react";
import { useState, useEffect } from "react";
import { Grid } from "antd";
import closeButton from "../../../assets/images/close_btn.svg";

function ExitButton(props) {
  const circle = {
    height: "44px",
    width: "42px",
  };
  function handleClick() {
    console.debug(props.callBack);
    props.callBack();
  }
  return (
    <div
      className="circle"
      style={{ display: "inline-block", background: "#232323" }}
      onClick={handleClick}
    >
      <ReactSVG id="bigSvg" src={closeButton}></ReactSVG>
    </div>
  );
}

export default ExitButton;
