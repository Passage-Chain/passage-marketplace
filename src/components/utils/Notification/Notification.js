import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import moment from "moment";

import Notify from "./notify";

import { ReactComponent as CloseIcon } from "../../../assets/images/icon-close-simple.svg";
import { ReactComponent as UpIcon } from "../../../assets/images/icon-up-arrow.svg";
import PassageLogo from "../../../assets/images/PassageAvatar.png";

import { icons } from "./icons";

import "./index.scss";

const getFormatedTime = (date = new Date()) => {
  let formattedTime = "";
  try {
    formattedTime = moment(date).format("hh:mm A");
  } catch (err) {
    console.log(err);
  }

  return formattedTime;
};

let handler

const Notification = () => {
  const [showLess, setShowLess] = useState(true);
  const { notifications, visibility } = useSelector((state) => state.notification);

  useEffect(() => {
    if (visibility && showLess) {
      handler = setTimeout(() => {
        Notify.hide()
      }, 5000)
    }

    if (!showLess) {
      clearTimeout(handler)
    }
  }, [visibility, showLess])

  useEffect(() => {
    if (notifications.length < 1) {
      setShowLess(true)
    }
  }, [notifications.length])

  const handleShowMore = () => {
    setShowLess(false);
  };

  const handleShowLess = () => {
    setShowLess(true);
  };

  const handleClear = (index) => {
    Notify.clear(index);
  };

  const handleClearAll = () => {
    Notify.clearAll();
    setShowLess(true)
  };

  return (
    <>
      {notifications.length > 0 && visibility ? (
        <div className="notification__container">
          <div className="notify-container">
            <div
              className={showLess ? "stacked-box-container" : "box-container"}
              onClick={(e) => {
                if (notifications.length === 1) {
                  e.preventDefault();
                } else {
                  e.stopPropagation();
                  handleShowMore();
                }
              }}
            >
              {notifications.map((item, index) => (
                <div className={`box ${showLess ? "stacked-box" : ""}`}>
                  <header className="box-header">
                    <div className="box-header-left">
                      <div className="box-icon">
                        <img src={item.action ? icons[item.action] : PassageLogo} />
                      </div>
                      <div className={`box-heading ${item.type}`}>
                        <span>{item.title}</span>
                      </div>
                    </div>
                    <div className="box-header-right">
                      <div className="box-time">
                        {getFormatedTime(item.time)}
                      </div>
                      <CloseIcon
                        style={{ width: 8, height: 8 }}
                        className="box-close"
                        onClick={() => {
                          handleClear(index);
                        }}
                      />
                    </div>
                  </header>

                  <body className="box-content">{item.body}</body>
                </div>
              ))}
            </div>
            <div className="notify-option-wrapper">
              <div className="notify-option" onClick={handleShowLess}>
                <UpIcon style={{ width: 12, height: 6 }} />
                <span>Show Less</span>
              </div>
              <div className="notify-option" onClick={handleClearAll}>
                <CloseIcon style={{ width: 8, height: 8 }} />
                <span>Clear All</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Notification;
