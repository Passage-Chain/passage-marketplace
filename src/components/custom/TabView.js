import React from "react";
import { Badge } from "antd";
import "./index.scss";

const TabView = ({ activeTab, tabs, handleTabChange, children, count = 5 }) => {
  return (
    <>
      <ul className="tab-view__container">
        {tabs.map((tab, index) => (
          <li
            key={tab.label}
            className={`tab ${activeTab === index ? "tab-active" : ""}`}
            onClick={() => handleTabChange(index)}
          >
            <Badge count={tab.count || 0} size="small">
              {activeTab === index && tab.activeIcon ? tab.activeIcon : tab.icon ? tab.icon : ''}
            </Badge>
            {tab.label}
          </li>
        ))}
      </ul>

      <div className="tab-view__content">
        {children}
      </div>
    </>
  );
};

export default TabView;
