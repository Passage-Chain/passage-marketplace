import { auto } from "async";
import { ReactSVG } from "react-svg";
import React, { Component } from "react";
import { useState, useEffect } from "react";
import { Grid } from "antd";

function CircleButton(props) {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    if (screens.xl) {
      setIsDesktop(true);
    } else {
      setIsDesktop(false);
    }
  }, [screens]);
  const image = props.img;
  const imageDisable = props.imgDisabled;

  const [flag, setFlag] = useState(false);
  // height: 44px, width: 42px in mobile

  const circle = {
    height: "44px",
    width: "42px",
  };

  function changeOnClick() {
    if (flag === true) {
      setFlag(false);
    } else {
      setFlag(true);
    }
  }

  return (
    <div className="circle" style={circle} onClick={() => changeOnClick()}>
      <ReactSVG id="bigSvg" src={flag ? imageDisable : image}></ReactSVG>
    </div>
  );
}

export default CircleButton;
