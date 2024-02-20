import React, { useState, useEffect, useRef } from "react";
import { Popover, Badge } from "antd";
import "./index.scss";
import { Modal } from "antd";

import accountHttpService from "../../services/account";
import { CustomAvatar } from ".";
import LogInForm from "src/views/Log In/LoginForm";

import Avatar from "../../assets/images/left_menu_passageLogo.svg";
import { useDispatch, useSelector } from "react-redux";
import BellNotificationBox from "../shared/BellNotificationBox/BellNotification";
import LogoutSettingPanel from "../shared/LogoutSettingPanel/logoutSettingPanel";
import { setShowChatWindow } from "../../redux/chatSlice";

import { ReactComponent as NewMessageIcon } from "../../assets/images-v2/message_chat_new.svg";
import { ReactComponent as MessageIcon } from "../../assets/images-v2/message_chat.svg";
import { ReactComponent as NotificationIcon } from "../../assets/images-v2/notification.svg";
import { ReactComponent as NewNotificationIcon } from "../../assets/images/bell_icon.svg";

const UserDetails = ({}) => {
  const [open, setOpen] = useState(false);
  const account = useSelector((state) => state.account);
  const token = useSelector((state) => state.account.token);
  const [notifications, setNotifications] = useState([]);
  const address = localStorage.getItem("active_address");
  const { unreadCount } = useSelector((state) => state.chat);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [isShowNotification, setNotification] = useState(false);
  const [expandSection, setExpandSection] = useState(false);
  const dispatch = useDispatch();

  const userDetailRef = useRef();

  const hideModal = () => {
    setOpen(false);
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleClickOutside = (event) => {
    if (
      userDetailRef.current &&
      !userDetailRef.current.contains(event.target)
    ) {
      setExpandSection(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    getAllNotification();
  }, []);

  const getAllNotification = () => {
    accountHttpService
      .getNotifications()
      .then((res) => {
        setNotifications(res.data.notifications);
        setUnreadNotificationCount(res.data.unread);
      })
      .catch((error) => console.log(error));
  };

  const opennotification = () => {
    // history.push("/app/Notification");
    const res = !isShowNotification;
    setNotification(res);
  };

  const handleMessageClick = () => {
    dispatch(setShowChatWindow(true));
  };

  const toggleSectionClick = () => {
    setExpandSection(!expandSection);
  };
  return (
    <div className={"user-details-container"} ref={userDetailRef}>
      {token ? (
        <>
          <div className="minimized">
            <div className="message-wrapper">
              {unreadCount > 0 ? (
                <NewMessageIcon
                  className="cursor-pointer"
                  onClick={handleMessageClick}
                />
              ) : (
                <MessageIcon
                  className="cursor-pointer"
                  onClick={handleMessageClick}
                />
              )}
            </div>

            <div className="notification-wrapper">
              <Popover
                placement="bottom"
                content={
                  <BellNotificationBox
                    unreadCount={unreadNotificationCount}
                    setUnreadCount={setUnreadNotificationCount}
                    notifications={notifications}
                    setNotifications={setNotification}
                    getAllNotification={getAllNotification}
                  />
                }
                trigger="click"
              >
                {unreadNotificationCount > 0 ? (
                  <NewNotificationIcon
                    className="cursor-pointer"
                    onClick={opennotification}
                  />
                ) : (
                  <NotificationIcon
                    className="cursor-pointer"
                    onClick={opennotification}
                  />
                )}
              </Popover>
            </div>

            <div className="profile-wrapper" onClick={toggleSectionClick}>
              <Badge dot={true} color="green" size="small">
                <CustomAvatar
                  color={"none"}
                  image={account.avatar || Avatar}
                  size={36}
                />
              </Badge>
              <label className="username cursor-pointer">
                {account ? account.username : ""}
              </label>
            </div>
          </div>
          {expandSection && <LogoutSettingPanel />}
        </>
      ) : address ? (
        <button
          style={{
            background: "none",
            border: "none",
            fontFamily: "Montserrat",
            fontWeight: "bold",
            color: "white",
            fontSize: "18px",
            textAlign: "center",
          }}
          onClick={showModal}
        >
          {address.slice(0, 14)}...
        </button>
      ) : (
        <button
          style={{
            background: "none",
            border: "none",
            fontFamily: "Montserrat",
            fontWeight: "bold",
            color: "white",
            fontSize: "18px",
            textAlign: "center",
          }}
          onClick={showModal}
        >
          Log In/Connect Wallet
        </button>
      )}
      <Modal
        className="login_modal"
        visible={open}
        onOk={hideModal}
        onCancel={hideModal}
      >
        <LogInForm alpha={true} closeModal={hideModal} />
      </Modal>
    </div>
  );
};

export default UserDetails;
