import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useChatContext } from "stream-chat-react";
import { CustomSearchInput, CustomInput, CustomAvatar } from "../../custom";
import { validateEmail } from "../../../configs";
import { setUpdateTimestamp } from "../../../redux/chatSlice";

import socialService from "../../../services/social";
import chatService from "../../../services/chatService";
import useDebounce from "../../../hooks/useDebounce";
import Toast from "../../custom/CustomToast";
import { useHistory } from "react-router-dom";
import { ReactComponent as CloseIcon } from "../../../assets/images/icon-new-close.svg";
import { ReactComponent as CheckSentIcon } from "../../../assets/images-v2/check-sent-icon.svg";

const CreateGroupModal = ({ handleClose, editMode = false }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [channelName, setChannelName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchText = useDebounce(searchQuery, 500);
  const [memberList, setMemberList] = useState([]);
  const dispatch = useDispatch();

  const { client, channel } = useChatContext();
  const { activeChannel } = useSelector((state) => state.chat);
  const members = Object.values(channel?.state?.members || {}).filter(
    ({ user }) => user.id !== client.userID
  );

  useState(() => {
    const memberList = members.map((member) => ({
      id: member?.user?.id,
      nickname: member?.user?.name,
      isExisting: true,
    }));

    setMemberList(memberList);
  }, [members?.length]);

  const activeChannelName =
    activeChannel?.type === "team"
      ? activeChannel?.data?.name
      : members[0]?.user?.name || "";

  const account = useSelector((state) => state.account);
  const history = useHistory();

  useEffect(() => {
    if (editMode) {
      setChannelName(activeChannelName);
    }
  }, [activeChannel]);

  useEffect(() => {
    if (debouncedSearchText) {
      fetchSearchResult();
    } else {
      setSearchList([]);
    }
  }, [debouncedSearchText]);

  const fetchSearchResult = async () => {
    try {
      const payload = {};
      if (validateEmail(debouncedSearchText)) {
        payload.email = debouncedSearchText;
      } else {
        payload.nickname = debouncedSearchText;
      }
      const response = await socialService.searchUser(payload);

      let filteredList =
        response?.data?.users?.filter((user) => user.id !== account.id) || [];

      setSearchList(filteredList);
    } catch (error) {
      Toast.error("error", error.response.data.message);

      setSearchList([]);
    }
  };

  const handleGroupNameInput = (e) => {
    const { value } = e.target;
    setChannelName(value);
  };

  const handleUserSearch = (user) => {
    setSearchQuery(user);
  };

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
  };

  const isValid = () => {
    if (editMode) {
      return channelName;
    } else {
      return channelName && selectedUsers.length;
    }
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        const payload = {
          id: channel?.id,
          channelName,
        };
        await chatService.renameGroup(payload);

        Toast.success(
          "Group Edited!",
          `The group ${channelName} was edited successfully!`
        );
      } else {
        const payload = {
          channelName,
          userEmails: [...selectedUsers.map((user) => user.email)],
        };
        await chatService.createGroup(payload);
        Toast.success(
          "Group Created!",
          `The group ${channelName} was created successfully!`
        );
      }
      dispatch(setUpdateTimestamp(new Date().getTime()));
    } catch (err) {
      if (err.response.status === 401) history.push("/");
      console.log(err);
      Toast.error("Unsuccessful", "Something went wrong, please try again!");
    }

    handleClose();
  };

  // const onRemoveUserClick = () => {
  //   setConfirmRemoveUser(true);
  // };

  // const handleRemoveMember = async (user) => {
  //   try {
  //     const payload = {
  //       channelId: channel?.id,
  //       userId: user?.id,
  //     };
  //     await chatService.removeMemberFromGroup(payload);

  //     const members = Object.values(channel?.state?.members || {});

  //     if (channel?.type === "messaging") {
  //       const updatedChannelName = members
  //         .map((member) => member?.user?.name)
  //         .join(", ");
  //       const payload = {
  //         id: channel?.id,
  //         channelName: updatedChannelName,
  //       };
  //       await chatService.renameGroup(payload);
  //     }

  //     Toast.success(
  //       "Member Removed!",
  //       `The member has been removed successfully!`
  //     );
  //   } catch (error) {
  //     console.log(error);
  //     Toast.error("Unsuccessful", "Something went wrong, please try again!");
  //   }
  // };

  // const cancelRemove = () => {
  //   setConfirmRemoveUser(false);
  // };

  const renderAddMemberView = (user) => {
    return (
      <>
        {isAlreadyAMember(user) ? (
          <div className="added-wrapper">
            <span className="added-text">Added</span>
            <CheckSentIcon />
          </div>
        ) : (
          <div className="add-icon" onClick={() => handleSelectUser(user)} />
        )}
      </>
    );
  };

  const isAlreadyAMember = (user) => {
    if (editMode) {
      return (
        (activeChannel?.state?.members || {})[user?.id] ||
        selectedUsers.map((user) => user.email).includes(user?.email)
      );
    } else {
      return selectedUsers.map((user) => user.email).includes(user?.email);
    }
  };

  return (
    <div className="create-group-modal__container">
      <div className="create-group-inner-container">
        <header>
          <CloseIcon className="cg-close-icon" onClick={handleClose} />
          <div className="logo-wrapper">
            <span>{editMode ? "EDIT" : "NEW"} GROUP CHAT</span>
          </div>
        </header>

        <div className="cg-search-container">
          <div className="cg-group-name-input-wrapper">
            <CustomAvatar size={44} name={channelName} />
            <CustomInput
              value={channelName}
              height={44}
              placeHolder="Group Name"
              onChange={handleGroupNameInput}
              maxLength={20}
              divWidth="88%"
            />
          </div>
          {!editMode && (
            <CustomSearchInput
              onChange={handleUserSearch}
              expanded={true}
              style={{ width: "100%", height: 44 }}
            />
          )}

          <div className="cg-list-container">
            <div className="cg-list-header">MEMBERS</div>
            <div className="cg-list-wrapper">
              {(editMode ? memberList : searchList).map((user, index) => (
                <div key={index} className="list-item">
                  <div className="user-name-details">
                    <CustomAvatar name={user.nickname} image={user.profileImage} size={36} />
                    <span className="user-name">{user.nickname}</span>
                  </div>

                  {/* {editMode ? renderEditMemberView(user) : renderAddMemberView(user)} */}
                  {!editMode && renderAddMemberView(user)}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="cg-footer">
          <button
            className="cg-submit-btn"
            disabled={isValid() ? false : true}
            onClick={handleSubmit}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
