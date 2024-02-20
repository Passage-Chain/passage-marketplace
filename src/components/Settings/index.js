import React, { useState } from "react";
import Account from "./Account";
import Controls from "./Controls";

import { ReactComponent as SettingIcon } from "../../assets/images/icon-settings.svg";
import { ReactComponent as CloseIcon } from "../../assets/images/icon-close-bordered.svg";

import "./index.scss";

const SIDE_OPTIONS = ["ACCOUNT", "AUDIO", "VIDEO", "PRIVACY", "CONTROLS"];

const Settings = ({ onExitSetting }) => {
  const [activeOption, setActiveOption] = useState(SIDE_OPTIONS[0]);

  return (
    <div className="user-preference__container">
      <div className="up__outer-container">
        <div className="up__inner-container">
          <div className="up__header">
            <div className="up_header-left">
              <SettingIcon />
              <span className="header-label">Settings</span>
            </div>
            <CloseIcon className="cursor-pointer" onClick={onExitSetting} />
          </div>

          <div className="up__body">
            <div className="up__sidebar">
              {SIDE_OPTIONS.map((option) => (
                <div
                  className={`up__sidebar-option ${
                    option === activeOption ? "active-option" : ""
                  }`}
                  onClick={() => setActiveOption(option)}
                >
                  <div className="label-text">{option}</div>
                </div>
              ))}
            </div>

            <div className="up__content">
              {activeOption === 'ACCOUNT' && <Account />}
              {activeOption === 'CONTROLS' && <Controls />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
