import { auto } from "async";
import { ReactSVG } from "react-svg";
import React, { Component, useEffect } from "react";
import { useState } from "react";

function DesktopToogleButton(props) {
  const image = props.img;
  const imageDisable = props.imgDisabled;

  const circle = {
    height: "62px",
    width: "62px",
  };

  return (
    <div className="circle" style={circle}>
      <ReactSVG
        id="bigSvg"
        src={props.isToogled ? imageDisable : image}
      ></ReactSVG>
    </div>
  );
}

export default DesktopToogleButton;
