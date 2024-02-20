import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useChatContext } from "stream-chat-react";
import { CustomInput } from "../../custom";

import chatService from "../../../services/chatService";
import { setUpdateTimestamp } from "../../../redux/chatSlice";

import Toast from "../../custom/CustomToast";

import { ReactComponent as CloseIcon } from "../../../assets/images/icon-close.svg";
import { ReactComponent as GroupChatIcon } from "../../../assets/images/icon-group-chat.svg";

import "./index.scss";

const RenameGroupModal = ({ handleClose }) => {
  const { client, channel } = useChatContext();
  const dispatch = useDispatch();
  const members = Object.values(channel?.state?.members || {}).filter(
    ({ user }) => user.id !== client.userID
  );

  const activeChannelName =
    channel?.type === "team"
      ? channel?.data?.name
      : members[0]?.user?.name || "";

  const [channelName, setChannelName] = useState(activeChannelName);

  const handleChannelNameInput = (e) => {
    const { value } = e.target;
    setChannelName(value);
  };

  const isValid = () => {
    return channelName;
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        id: channel?.id,
        channelName,
      };
      const response = await chatService.renameGroup(payload);
      Toast.success("Group Renamed", "The group was renamed successfully!");
      dispatch(setUpdateTimestamp(new Date().getTime()));
    } catch (error) {
      console.log(error);
      Toast.error("Unsuccessful", "Something went wrong, please try again!");
    }

    handleClose();
  };

  return (
    <div className="rename-group-modal__container">
      <div className="rename-inner-container">
        <header>
          <div className="left">
            <GroupChatIcon />
            <span>RENAME GROUP</span>
          </div>
          <CloseIcon className="cursor-pointer" onClick={handleClose} />
        </header>

        <div className="rename-content">
          <CustomInput
            value={channelName}
            height={60}
            placeHolder="Group Name"
            onChange={handleChannelNameInput}
            maxLength={20}
          />
        </div>

        <footer>
          <button onClick={handleClose}>CANCEL</button>
          <button
            className="create-btn"
            disabled={isValid() ? false : true}
            onClick={handleSubmit}
          >
            RENAME
          </button>
        </footer>
      </div>
    </div>
  );
};

export default RenameGroupModal;
