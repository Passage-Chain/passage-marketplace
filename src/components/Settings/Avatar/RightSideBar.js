import axios from "axios";

import { Image } from "antd";
import { HexColorPicker } from "react-colorful";
import { CameraOutlined, StopOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import configURL from "./config";

function RightSideBar({
  sections,
  face,
  head,
  leftHand,
  rightHand,
  active,
  avatar,
  changeAvatar,
  setActive,
  openCamera,
}) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const changeActive = (key) => {
    const section = sections[key];
    if (active && section?.section === active) {
      setActive(null);
    } else {
      setActive(key);
    }
  };

  const changeColor = (color) => {
    changeAvatar({ ring: color });
  };

  const changeSkin = (skin) => {
    changeAvatar({ skin: skin });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(`${configURL.ASSETS}`, config);
        const data = response.data.data.filteredMongoDbProperties;
        // console.log("data", data);
        const result = {};
        data.forEach((item) => {
          const slot = item.slots[0];
          if (!result[slot]) {
            result[slot] = [];
          }
          result[slot].push({
            icon: item["2dURI"],
            id: item._id,
          });
        });
        setData(result);
        // console.log("new method----", result);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  if (isLoading) {
    return (
      <div className='right-section'>
        <div className='sections'>
          {!!(sections && Object.keys(sections)) &&
            Object.keys(sections).map((key, index) => {
              return (
                <Image
                  className='cursor'
                  src={
                    active === key
                      ? sections[key].activeIcon
                      : sections[key].icon
                  }
                  preview={false}
                  key={"section-" + index}
                  width={sections[key].width}
                  onClick={() => changeActive(key)}
                />
              );
            })}
        </div>
      </div>
    );
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className='right-section'>
      <div
        className={"items " + (active ? "" : "d-none")}
        style={
          active == "innerRing" || active == "outerRing"
            ? { width: 300 }
            : { width: 210 }
        }
      >
        <div
          className='sideBar-view'
          style={
            active == "innerRing" || active == "outerRing"
              ? { width: 300 }
              : { width: 210 }
          }
        >
          {active === "face" ? (
            <>
              {/* <div onClick={openCamera}>
                <CameraOutlined className='first-item' />
              </div> */}
              {face.map((item, index) => {
                return (
                  <div key={"rightHand-" + index}>
                    <SectionImage
                      url={item.icon}
                      className={avatar.face?.id === item.id ? "active" : ""}
                      save={() =>
                        changeAvatar({ face: item, cameraImage: null })
                      }
                    />
                  </div>
                );
              })}
            </>
          ) : active === "head" && !isLoading ? (
            <>
              {/* {console.log("data in state", avatar)} */}
              <div onClick={() => changeAvatar({ head: null })}>
                <StopOutlined className='first-item' />
              </div>
              {data.Hats.map((item, index) => {
                return (
                  <div
                    key={"head-" + item.id}
                    className={
                      avatar.head?.id === item.id
                        ? "active head-asset-container"
                        : "head-asset-container"
                    }
                  >
                    <SectionImage
                      url={item.icon}
                      save={() => changeAvatar({ head: item })}
                    />
                  </div>
                );
              })}
            </>
          ) : active === "leftHand" && !isLoading ? (
            <>
              <div onClick={() => changeAvatar({ leftHand: null })}>
                <StopOutlined className='first-item' />
              </div>
              {data.RightHand.map((item, index) => {
                return (
                  <div
                    key={"leftHand-" + item.id}
                    className={
                      avatar.leftHand?.id === item.id
                        ? "active leftHand-asset-container"
                        : "leftHand-asset-container"
                    }
                  >
                    <SectionImage
                      url={item.icon}
                      save={() => changeAvatar({ leftHand: item })}
                    />
                  </div>
                );
              })}
            </>
          ) : active === "rightHand" && !isLoading ? (
            <>
              <div onClick={() => changeAvatar({ rightHand: null })}>
                <StopOutlined className='first-item' />
              </div>
              {data.LeftHand.map((item, index) => {
                return (
                  <div
                    key={"rightHand-" + item.id}
                    className={
                      avatar.rightHand?.id === item.id
                        ? "active rightHand-asset-container"
                        : "rightHand-asset-container"
                    }
                  >
                    <SectionImage
                      url={item.icon}
                      save={() => changeAvatar({ rightHand: item })}
                    />
                  </div>
                );
              })}
            </>
          ) : active === "innerRing" ? (
            <HexColorPicker
              color={avatar?.ring}
              onChange={changeColor}
            ></HexColorPicker>
          ) : active === "outerRing" ? (
            <HexColorPicker color={avatar?.skin} onChange={changeSkin} />
          ) : null}
        </div>
      </div>
      <div className='sections'>
        {!!(sections && Object.keys(sections)) &&
          Object.keys(sections).map((key, index) => {
            return (
              <Image
                className='cursor'
                src={
                  active === key ? sections[key].activeIcon : sections[key].icon
                }
                preview={false}
                key={"section-" + index}
                width={sections[key].width}
                onClick={() => changeActive(key)}
              />
            );
          })}
      </div>
    </div>
  );
}

export default RightSideBar;

function SectionImage({ url, className = "", save }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      <img
        style={loaded ? {} : { display: "none" }}
        src={url}
        onLoad={() => setLoaded(true)}
        alt='asset'
        className={className}
        onClick={save}
      />
      {!loaded && <span alt='loading' className='asset-loading' />}
    </>
  );
}
