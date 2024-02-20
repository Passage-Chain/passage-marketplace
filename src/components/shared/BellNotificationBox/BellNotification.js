import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ReactComponent as DefaultImg } from "../../../assets/images/default_notify_img.svg";
import { ReactComponent as MessageIcon } from "../../../assets/images-v2/message_chat.svg";

import bellIcon from "../../../assets/images/icon_bell.png";
import accountHttpService from "../../../services/account";
import Toast from "../../custom/CustomToast";
import { setChatUserId, setDmTimestamp, setIsDM, setShowChatWindow, setChatType } from "../../../redux/chatSlice";

import "./index.scss";

const BellNotificationBox = ({ unreadCount, setUnreadCount, notifications, setNotifications, getAllNotification }) => {
  const history = useHistory();
  const dispatch = useDispatch()

  const removeCurrentNotification = (e) => {
    console.log('notification ', e);
    //const itemPos = data.findIndex(item => item.notificationId === e.notificationId);
    const updatedData = notifications.filter((x) => x.notificationId !== e.notificationId);
    setNotifications(updatedData)
  }
  const markAllAsSeen = () => {
    accountHttpService.markAllAsRead().then((res) => {
      console.log('notifyID ---> ', res.data);
      Toast.success('Notification', res.data.message);
      getAllNotification();
    }).catch((error) => (console.log(error)));
    //setData(data);
  }
  const redirectToNotification = () => {
    history.push("/app/Notification");
  }

  function timeSince(d) {
    const date = new Date(d+'Z')
    let seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
      return date.toLocaleDateString("en-US").replaceAll('/', '.');
      // return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  }

  const markAsRead = (id) => {
    accountHttpService.markAsReadByNotifId(id).then((res) => {
      getAllNotification();
      //setData(res.data.notifications)
    }).catch((error) => (console.log(error)));
  }
  // history.push("/app/Notification");

  const handleOpenChat = (senderId, chatType) => {
    dispatch(setChatUserId(senderId))
    dispatch(setIsDM(true))
    dispatch(setShowChatWindow(true))
    dispatch(setDmTimestamp(new Date().getTime()))
    dispatch(setChatType(chatType))
  }

  return (
    <>
      <div className="notification-box">
        <div className="notification-header">
          <span className="title"><img src={bellIcon} alt="bell" /> Notification <span className={`${(notifications.length).toString().length > 1 ? 'count_two_digit_padding' : 'count_one_digit_padding'} count`}>{unreadCount || 0}</span></span>
          <span className="markAll" onClick={markAllAsSeen}>Mark all as seen</span>
        </div>
        <div className="notify-items-container">
          {notifications.length ? notifications.map((eventItem, idx) => (
            <div className="notify-item" key={idx}>
              <div className="content" onClick={() => {
                if (!eventItem.isRead) {
                  markAsRead(eventItem.id)
                }
                if (eventItem.content?.notificationType === 'chat') {
                  handleOpenChat(eventItem?.content?.senderId, eventItem?.content?.chatType)
                }
              }}>
                <div className="image">
                  {eventItem.content.notificationType === 'chat' ?
                    <MessageIcon className="notify-img"/> :
                    <DefaultImg className="notify-img" />
                  }
                </div>
                <div className="message">
                  {eventItem.content?.notificationType === 'chat' &&
                    <div className={eventItem.isRead ? "markAsReadItem" : "text"}>
                      {eventItem.content.sender}
                    </div>
                  }
                  <div className={eventItem.isRead ? "markAsReadItem" : "text"}>{eventItem.content.data}</div>
                  <div className="time">{timeSince(eventItem.time)}</div>
                </div>
              </div>

              {/* <span onClick={() => removeCurrentNotification(eventItem)}>&times;</span> */}
            </div>
          )) :
            <div className="empty_notification">No notifications found</div>
          }
        </div>
      </div>
    </>
  );
};

export default BellNotificationBox;
