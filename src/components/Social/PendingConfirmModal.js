import React from "react";
import { ReactComponent as CloseIcon } from "../../assets/images/icon-close-trans.svg";
import { ReactComponent as RejectIcon } from "../../assets/images/icon-reject.svg";
import { ReactComponent as AcceptIcon } from "../../assets/images/icon-accept.svg";
import "./index.scss";

const types = {
  accept: {
    icon: <AcceptIcon />,
    title: <span>Accept Invitation</span>,
    subText: (userName) => (
      <span className="sub-text">
        You are about to accept the invitation send by{" "}
        <span className="name">{userName}</span>. Are you sure you wish to
        continue?
      </span>
    ),
    okBtnText: "ACCEPT",
    isPositive: true,
  },
  reject: {
    icon: <RejectIcon />,
    title: <span>Reject Invitation</span>,
    subText: (userName) => (
      <span className="sub-text">
        You are about to reject the invitation send by{" "}
        <span className="name">{userName}</span>. Are you sure you wish to
        continue?
      </span>
    ),
    okBtnText: "REJECT",
  },
  confirm: {
    icon: '',
    title: <span>Discard Changes</span>,
    subText: () => (
      <span className="sub-text">
        Do you want to discard the changes?
      </span>
    ),
    okBtnText: "Yes",
    cancelBtnText: "No"
  },
};

const PendingConfirmModal = ({ onCancel, type, user, onOkay, userName }) => {
  return (
    <div className="pending__confirm-modal">
      <div className="inner-container">
        <div className="header">
          <div className="left">
            {types[type]?.icon}
            <span>{types[type]?.title}</span>
          </div>
        <CloseIcon onClick={onCancel} className="cursor-pointer" />
        </div>
        <div className="content">
            {types[type]?.subText(userName)}
        </div>
        <div className="footer">
          <button className="btn" onClick={onCancel}>{types[type]?.cancelBtnText || 'CANCEL'}</button>
          <button
            className={`btn ${
              types[type]?.isPositive ? "btn-positive" : "btn-negative"
            }`}
            onClick={() => onOkay(user)}
          >
            {types[type]?.okBtnText || "OKAY"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingConfirmModal;
