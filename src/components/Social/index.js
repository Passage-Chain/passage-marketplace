import React, { useEffect, useState } from "react";
import AddFriendModal from "./AddFriendModal";
import FriendList from "./FriendList";

import { ReactComponent as UnionUserIcon } from "../../assets/images/icon-union-user.svg";
import { ReactComponent as CloseIcon } from "../../assets/images/icon-close.svg";
import { ReactComponent as FriendsIcon } from "../../assets/images/icon-friends.svg";
import { ReactComponent as PendingInvitesIcon } from "../../assets/images/icon-pending-invites.svg";
import { ReactComponent as FriendsActiveIcon } from "../../assets/images/icon-friends-active.svg";
import { ReactComponent as PendingInvitesActiveIcon } from "../../assets/images/icon-pending-invites-active.svg";

import "./index.scss";
import TabView from "../custom/TabView";
import PendingInvitesList from "./PendingInvitesList";
import socialService from "../../services/social";

const Social = ({ onExitFriendsClick }) => {
  const [openAddFriendModal, setOpenAddFriendModal] = useState(false);
  const [friendList, setFriendList] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [pendingInviteCount, setPendingInviteCount] = useState(0)

  useEffect(() => {
    fetchPendingInviteCount()
  }, [activeTab])

  let TABS = [
    {
      label: "FRIENDS",
      activeIcon: <FriendsActiveIcon />,
      icon: <FriendsIcon />,
    },
    {
      label: "PENDING INVITES",
      activeIcon: <PendingInvitesActiveIcon />,
      icon: <PendingInvitesIcon />,
      count: pendingInviteCount
    },
  ];

  const fetchPendingInviteCount = async () => {
    try {
      const response = await socialService.getPendingInvites();
      const list = response?.data?.result || [];
      setPendingInviteCount(list?.length)
    } catch (error) {
      console.log(error);
      setPendingInviteCount(0)
    }
  };

  const components = [
    <FriendList
      friendList={friendList}
      setFriendList={setFriendList}
      openAddFriendModal={setOpenAddFriendModal}
    />,
    <PendingInvitesList fetchPendingInviteCount={fetchPendingInviteCount} />,
  ];

  return (
    <>
      <div className="social__container">
        <div className="inner-container">
          <div className="social__friendlist-panel">
            <div className="main-wrapper">
              <header>
                <div className="left">
                  <UnionUserIcon />
                  <span>SOCIAL</span>
                </div>
                <CloseIcon
                  className="cursor-pointer"
                  onClick={onExitFriendsClick}
                />
              </header>

              <body>
                <TabView
                  tabs={TABS}
                  activeTab={activeTab}
                  handleTabChange={setActiveTab}
                >
                  {components[activeTab]}
                </TabView>
              </body>
            </div>
          </div>
        </div>
      </div>
      {openAddFriendModal && (
        <AddFriendModal
          friendList={friendList}
          handleClose={() => setOpenAddFriendModal(false)}
        />
      )}
    </>
  );
};

export default Social;
