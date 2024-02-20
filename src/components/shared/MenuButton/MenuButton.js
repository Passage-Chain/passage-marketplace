import { auto } from "async";
import { ReactSVG } from "react-svg";
import React, { Component } from "react";
import { useState } from "react";

function MenuButton(props) {
  const button = {
    height: "44px",
    width: "42px",
  };
  return (
    <div className="button" style={button} >
        <ReactSVG src={props.img}></ReactSVG>
    </div>
  );
}
export default MenuButton;
