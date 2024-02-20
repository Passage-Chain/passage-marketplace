import React from "react";
import { ReactComponent as CancelRequestIcon } from "../../assets/images/icon-cancel-request.svg";
import { ReactComponent as RemoveFriendIcon } from "../../assets/images/icon-unfriend.svg";
import { ReactComponent as TeleportIcon } from "../../assets/images/icon-teleport.svg";
import { ReactComponent as LeaveGroupIcon } from "../../assets/images/icon-leave-group.svg";
import { ReactComponent as MuteGroupIcon } from "../../assets/images/icon-mute.svg";
import { ReactComponent as AcceptIcon } from "../../assets/images-v2/accept-icon.svg";
import { ReactComponent as CloseIcon } from "../../assets/images-v2/close-x.svg";
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
    icon: <LeaveGroupIcon style={{ width: 20, height: 20 }} />,
    title: <span>LEAVE GROUP</span>,
    subText: (userName) => <span>You are about to leave this group. Are you sure you wish to continue?</span>,
    okBtnText: 'LEAVE'
  },
  muteGroup: {
    icon: <MuteGroupIcon style={{ width: 20, height: 20 }}/>,
    title: <span>MUTE NOTIFICATIONS</span>,
    subText: (groupName) => <span>You are about to mute the Chat <span className="name">{groupName}</span>. Are you sure you wish to continue?</span>,
    okBtnText: 'MUTE'
  },
  acceptInvite: {
    icon: <AcceptIcon />,
    title: <span>Accept Invitation</span>,
    subText: (userName) => <span>You are about to accept the invitation sent by <span className="name">{userName}</span>. Are you sure you wish to continue?</span>,
    okBtnText: 'ACCEPT'
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
    <div className="social-v2__confirm-modal">
      <div className="modal-container">
        <div className="s2cm-header">
          <div className="s2cm-header-left">
            <span className="icon">{types[type]?.icon}</span>
            <span className="title">{types[type]?.title}</span>
          </div>
          <div className="s2cm-header-right">
            <CloseIcon onClick={onCancel}/>
          </div>
        </div>
        <div className="confirm-modal__content">
          <span className="sub-text">{types[type]?.subText(user?.nickname)}</span>
        </div>
        <div className="confirm-modal__footer">
          <button className="btn-cancel" onClick={onCancel}>CANCEL</button>
          <button className="btn-okay" onClick={() => onOkay(user)}>{types[type].okBtnText || 'OKAY'}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
