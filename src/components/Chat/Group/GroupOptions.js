import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Popover } from "antd";
import { useChatContext } from "stream-chat-react";
import AddMembersModal from "./AddMembersModal";

import {
  setUpdateTimestamp,
  setViewMemberList,
} from "../../../redux/chatSlice";

import { ReactComponent as OptionIcon } from "../../../assets/images-v2/arrow-down-icon.svg";

import RenameGroupModal from "./RenameGroupModal";

import chatService from "../../../services/chatService";
import { setAccused, setShowReportUserModal } from "../../../redux/reportSlice";
import "./index.scss";

import Toast from "../../custom/CustomToast";

const OPTIONS = [
  {
    type: ["team"],
    name: () => "Edit Chat",
    action: ({ handleEditGroupClick }) => {
      handleEditGroupClick();
    },
  },
  {
    type: ["team", "messaging"],
    name: ({ isMuted }) =>
      isMuted ? "Unmute Chat" : "Mute Chat",
    action: ({ setActionType, isMuted, handleUnmute }) => {
      if (isMuted) {
        handleUnmute();
      } else {
        setActionType(ACTIONS.MUTE_GROUP);
      }
    },
  },
  {
    type: ["team"],
    name: () => "Leave Chat",
    action: ({ setActionType }) => {
      setActionType(ACTIONS.LEAVE_GROUP);
    },
  },
  {
    type: ["messaging"],
    name: () => "Report User",
    action: ({ handleReportUserClick }) => {
      handleReportUserClick();
    },
  },
];

const ACTIONS = {
  MUTE_GROUP: "muteGroup",
  LEAVE_GROUP: "leaveGroup",
};

const Menu = ({
  setActionType,
  handleEditGroupClick,
  handleViewMembersClick,
  handleUnmute,
  isMuted,
  handleHide,
  channelType,
  handleAddMembersClick,
  handleReportUserClick
}) => {
  return (
    <div className="menu__container">
      {OPTIONS.filter(option => option.type?.includes(channelType)).map((option, index) => (
        <div
          className={`menu ${
            index !== OPTIONS.length - 1 ? "menu-border-bottom" : ""
          }`}
          onClick={() => {
            option.action({
              setActionType,
              handleEditGroupClick,
              handleViewMembersClick,
              handleUnmute,
              isMuted,
              handleAddMembersClick,
              handleReportUserClick
            });

            handleHide()
          }}
        >
          {option.name({ isMuted })}
        </div>
      ))}
    </div>
  );
};

const GroupOptions = ({ handleEditGroupClick, actionType, setActionType, showConfirmModal, setShowConfirmModal }) => {
  const [showRenameGroupModal, setShowRenameGroupModal] = useState(false);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false)
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const { client, channel } = useChatContext();
  const members = Object.values(channel?.state?.members || {}).filter(
    ({ user }) => user.id !== client.userID
  );
  const muteData = channel?.muteStatus();

  const channelName =
    channel?.type === "team"
      ? channel?.data?.name
      : members[0]?.user?.name || "";

  const dispatch = useDispatch();

  useEffect(() => {
    if (actionType) {
      setShowConfirmModal(true);
    }
  }, [actionType]);

  const handleCloseRenameGroup = () => {
    setShowRenameGroupModal(false);
  };

  const handleViewMembersClick = () => {
    dispatch(setViewMemberList(true));
  };

  const handleReportUserClick = () => {
    const accused = {
      friendId: Object.values(channel?.state?.members || {}).find(
        ({ user }) => user.id !== client.userID
      )?.user?.id
    }
    dispatch(setAccused(accused))
    dispatch(setShowReportUserModal(true))
    // dispatch(setOnSuccess(() => {
    //   leaveGroup()
    // }))
  }

  const unMuteGroup = async () => {
    try {
      if (channel?.type === "team") {
        const payload = {
          id: channel?.id,
        };
        const response = await chatService.unMuteGroup(payload);
      }
      await channel.unmute();
      dispatch(setUpdateTimestamp(new Date().getTime()));
      Toast.success("Notifications Unmuted!", <div>You have unmuted notifications for {channel?.type === "team" ? 'Group' : ''} <b>{channelName}</b>!</div>);
    } catch (error) {
      console.log(error);
      Toast.error( "Unsuccessful",  "Something went wrong, please try again!" );
    }
    setShowConfirmModal(false);
    setActionType(undefined);
  };

  const handleHidePopover = () => {
    setIsPopoverVisible(false)
  }

  const handleVisibleChange = visible => {
    setIsPopoverVisible(visible)
  };

  const handleAddMembersClick = () => {
    setShowAddMembersModal(true)
  }

  const handleCloseAddMembersClick = () => {
    setShowAddMembersModal(false);
  };

  return (
    <div className="group-option__container">
      <Popover
        placement="bottomRight"
        visible={isPopoverVisible}
        onVisibleChange={handleVisibleChange}
        content={
          <Menu
            setActionType={setActionType}
            handleEditGroupClick={handleEditGroupClick}
            handleViewMembersClick={handleViewMembersClick}
            handleUnmute={unMuteGroup}
            isMuted={muteData?.muted}
            handleHide={handleHidePopover}
            channelType={channel?.type}
            handleAddMembersClick={handleAddMembersClick}
            handleReportUserClick={handleReportUserClick}
          />
        }
        trigger="click"
      >
        <OptionIcon className="option-icon" />
      </Popover>

      {showRenameGroupModal && (
        <RenameGroupModal handleClose={handleCloseRenameGroup} />
      )}

      {showAddMembersModal && (
        <AddMembersModal handleClose={handleCloseAddMembersClick} />
      )}
    </div>
  );
};

export default GroupOptions;
