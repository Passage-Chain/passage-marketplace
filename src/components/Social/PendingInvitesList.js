import React, { useEffect, useState } from "react";

import socialService from "../../services/social";

import { ReactComponent as UserIcon } from "../../assets/images/icon-user.svg";
import { ReactComponent as SearchIcon } from "../../assets/images/icon-search.svg";
import CloseBtnIcon from "../../assets/images/icon-close-btn.svg";
import RightIcon from "../../assets/images/icon-right.svg";

import { CustomButton, CustomInput } from "../custom";
import { getDurationFromNow } from "../Chat/utils";
import PendingConfirmModal from "./PendingConfirmModal";

import Notify from "../utils/Notification/notify";
import { googleAnalyticsActions } from "../../utils/googleAnalyticsInit";
import { TRACKING_ID } from "../../utils/globalConstant";

const ACTIONS = {
  ACCEPT: "accept",
  REJECT: "reject",
};

const PendingFriendList = ({ fetchPendingInviteCount }) => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(undefined);
  const [selectedUser, setSelectedUser] = useState(undefined);
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredList, setFilteredList] = useState([])

  useEffect(() => {
    if (searchQuery) {
      const filteredList = list.filter(friend => friend?.userData?.userName?.includes(searchQuery))
      setFilteredList(filteredList)
    } else {
      setFilteredList(list)
    }
  }, [searchQuery])

  useEffect(() => {
    setFilteredList(list)
  }, [list])

  useEffect(() => {
    fetchPendingInvites();
  }, []);

  useEffect(() => {
    if (actionType) {
      setShowConfirmModal(true);
    }
  }, [actionType]);

  const fetchPendingInvites = async () => {
    setIsLoading(true);
    try {
      const response = await socialService.getPendingInvites();
      const list = response?.data?.result || [];
      setList(list);
    } catch (error) {
      console.log(error);
      setList([]);
    }
    setIsLoading(false);
  };

  const handleRejectClick = (user) => {
    setActionType(ACTIONS.REJECT);
    setSelectedUser(user);
  };

  const handleAcceptClick = (user) => {
    setActionType(ACTIONS.ACCEPT);
    setSelectedUser(user);
  };

  const handleCancelConfirmModal = () => {
    setShowConfirmModal(false);
    setActionType(undefined);
  };

  const handleAcceptRequest = async (user) => {
    try {
      const response = await socialService.acceptFriendRequest({
        hash: user?.hash,
      });
      Notify.success({ title: "Invitation Accepted!", body: `You have accepted the invitation send by ${user?.userData?.userName}.`, action: 'invite_success' });
      fetchPendingInvites();
      fetchPendingInviteCount();
      googleAnalyticsActions.initGoogleAnalytics(TRACKING_ID, 'Accept Invitation', 'Successful');
    } catch (error) {
      console.log(error);
      Notify.error({ title: "Unsuccessful", body: "Something went wrong, please try again!" });
    }
    setSelectedUser(undefined);
    setShowConfirmModal(false);
    setActionType(undefined);
  };

  const handleRejectRequest = async (user) => {
    try {
      const response = await socialService.rejectFriendRequest({
        hash: user?.hash,
      });
      Notify.error({ title: "Invitation Cancelled!", body: `You have cancelled the invitation for ${user?.userData?.userName}.`, action: 'invite_fail' });
      fetchPendingInvites();
      fetchPendingInviteCount()
    } catch (error) {
      console.log(error);
      Notify.error({ title: "Unsuccessful", body: "Something went wrong, please try again!" });
    }
    setSelectedUser(undefined);
    setShowConfirmModal(false);
    setActionType(undefined);
  };

  const handleSearchInput = (e) => {
    const { value } = e.target
    setSearchQuery(value)
  }

  return (
    <div>
      {showConfirmModal && (
        <PendingConfirmModal
          user={selectedUser}
          userName={selectedUser?.userData?.userName}
          type={actionType}
          onCancel={handleCancelConfirmModal}
          onOkay={(user) => {
            if (actionType === ACTIONS.ACCEPT) {
              handleAcceptRequest(user);
            } else if (actionType === ACTIONS.REJECT) {
              handleRejectRequest(user);
            }
          }}
        />
      )}
      <div className="body-header">
        <div className="header-left">
          <CustomInput
            placeHolder="Search invites"
            prefix={<SearchIcon style={{ width: 16 }} />}
            height={40}
            width={312}
            value={searchQuery}
            onChange={handleSearchInput}
          />
        </div>
      </div>

      {filteredList?.length > 0 ? (
        <div className="body-content">
          <div className="content-header">
            <span>NAME</span>
            <span>ACTIONS</span>
          </div>

          <div className="content-list" id="list-container">
            {filteredList.map((item, index) => (
              <div className="friend-wrapper" key={index}>
                <div className="left">
                  <div className="user-icon-wrapper">
                    <UserIcon />
                  </div>

                  <div className="user-detail-wrapper">
                    <span className="user-name">
                      {item?.userData?.nickname}
                    </span>
                    <span className="mutual-friend-count">
                      {getDurationFromNow(item?.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="right" style={{ gap: 10 }}>
                  <CustomButton
                    type="error"
                    label="REJECT"
                    icon={CloseBtnIcon}
                    onClick={() => handleRejectClick(item)}
                  />
                  <CustomButton
                    label="ACCEPT"
                    icon={RightIcon}
                    onClick={() => handleAcceptClick(item)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-friends-text">
          {isLoading ? "Loading..." : `No Pending Invites`}
        </div>
      )}
    </div>
  );
};

export default PendingFriendList;
