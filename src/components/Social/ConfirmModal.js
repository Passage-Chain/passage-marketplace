import React from "react";
import { ReactComponent as CloseIcon } from "../../assets/images/icon-close.svg";
import { ReactComponent as CancelRequestIcon } from "../../assets/images/icon-cancel-request.svg";
import { ReactComponent as RemoveFriendIcon } from "../../assets/images/icon-unfriend.svg";
import { ReactComponent as TeleportIcon } from "../../assets/images/icon-teleport.svg";
import { ReactComponent as LeaveGroupIcon } from "../../assets/images/icon-leave-group.svg";
import { ReactComponent as MuteGroupIcon } from "../../assets/images/icon-mute.svg";
import { ReactComponent as IconDelete } from "../../assets/images/icon-delete.svg";

const types = {
  cancel: {
    icon: <CancelRequestIcon />,
    title: 'CANCEL REQUEST',
    subText: (userName) => <>You are about to cancel the invitation for <span className="name">{userName}</span>. Are you sure to continue?</>
  },
  remove: {
    icon: <RemoveFriendIcon />,
    title: <span>REMOVE FRIEND</span>,
    subText: (userName) => <span>You are about to remove your friend <span className="name">{userName}</span>. Are you sure to continue?</span>
  },
  teleport: {
    icon: <TeleportIcon />,
    title: <span>TELEPORT</span>,
    subText: (userName) => <span>You are about to be teleported to <span className="name">{userName}</span>. Are you sure to continue?</span>,
    isPositive: true
  },
  leaveGroup: {
    icon: <LeaveGroupIcon />,
    title: <span>LEAVE GROUP</span>,
    subText: (userName) => <span>You are about to leave this group. Are you sure you wish to continue?</span>,
    okBtnText: 'LEAVE'
  },
  muteGroup: {
    icon: <MuteGroupIcon />,
    title: <span>MUTE NOTIFICATIONS</span>,
    subText: (groupName) => <span>You are about to mute the Group <span className="name">{groupName}</span>. Are you sure you wish to continue?</span>,
    okBtnText: 'MUTE'
  },
  delete: {
    icon: <IconDelete />,
    title: <span>Delete Post</span>,
    subText: () => <span>Are you sure you want to delete this post?</span>,
    okBtnText: 'DELETE'
  },
}

const ConfirmModal = ({ onCancel, type, user, onOkay }) => {
  return (
    <div className="social__confirm-modal">
      <div className="modal-container">
        <div className="confirm-modal__header cursor-pointer" onClick={onCancel}>
          <CloseIcon />
        </div>
        <div className="confirm-modal__content">
          <span className="icon">{types[type]?.icon}</span>
          <span className="title">{types[type]?.title}</span>
          <span className="sub-text">{types[type]?.subText(user?.userName)}</span>
        </div>
        <div className="confirm-modal__footer">
          <button onClick={onCancel}>CANCEL</button>
          <button className={`btn-okay ${types[type]?.isPositive ? 'btn-positive' : ''}`} onClick={() => onOkay(user)}>{types[type].okBtnText || 'OKAY'}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
