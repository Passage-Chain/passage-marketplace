import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useChatContext } from "stream-chat-react";

import { setViewMemberList } from "../../../redux/chatSlice";

import { ReactComponent as BackIcon } from "../../../assets/images/icon-left.svg";
import { ReactComponent as AddIcon } from "../../../assets/images/icon-add.svg";
import { CustomAvatar } from "../../custom";
import AddMembersModal from "./AddMembersModal";

import "./index.scss"

const MemberList = () => {
  const { client, channel } = useChatContext();
  const members = Object.values(channel?.state?.members || {})

  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(setViewMemberList(false))
  }

  const handleAddMembersClick = () => {
    setShowAddMembersModal(true)
  }

  const handleCloseAddMembersClick = () => {
    setShowAddMembersModal(false);
  };

  return (
    <>
      <div className="member-list__container">
        <div className="header">
          <BackIcon onClick={handleClose}/>
          <span>Group Member(s)</span>
        </div>
        <div className="add-member" onClick={handleAddMembersClick}>
          <AddIcon />
          <span>Add New Member</span>
        </div>

        <div className="content">
          <div className="list-container">
            {members.map((member, index) => (
              <div key={index}>
                <div className="item">
                  <CustomAvatar size={32} image={member?.user?.profileImage}/>
                  <span className="user-name">{member?.user?.name}</span>
                </div>

                <div className="divider"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddMembersModal && (
        <AddMembersModal handleClose={handleCloseAddMembersClick} />
      )}
    </>
  );
};

export default MemberList;
