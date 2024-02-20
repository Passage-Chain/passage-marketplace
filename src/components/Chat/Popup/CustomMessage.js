import React, { useRef } from "react";
import {
  Attachment,
  MessageOptions,
  MessageRepliesCountButton,
  MessageText,
  MessageTimestamp,
  useMessageContext,
  useChatContext,
} from "stream-chat-react";

import { ReactComponent as DeleteIcon } from "../../../assets/images/icon-delete.svg";
import { ReactComponent as EmojiIcon } from "../../../assets/images/icon-emoji.svg";
import { ReactComponent as ReceivedIcon } from "../../../assets/images-v2/received-icon.svg";
import { ReactComponent as SentIcon } from "../../../assets/images-v2/sent-icon.svg";

import { CustomAvatar } from "../../custom";

export default () => {
  const { client, channel } = useChatContext();
  const {
    message,
    handleDelete,
    readBy,
    isMyMessage
  } = useMessageContext();

  const messageWrapperRef = useRef(null);
  const isMyMessageFlag = isMyMessage()

  const filteredReadBy = readBy.filter(user => user?.id !== client.userID)

  return (
    <div className="chat__custom-message">
      <div className="message-wrapper-content">
        <div
          className={`message-body ${
            isMyMessageFlag
              ? "logged_user_chat"
              : "friend_user_chat"
          } ${message?.type === "deleted" ? "deleted-message-wrapper" : ""}`}
        >
          {channel?.type === "team" &&
            !isMyMessageFlag && (
              <div>
                <CustomAvatar name={message?.user?.name} image={message?.user?.profileImage} size={24} />{" "}
              </div>
            )}
          {
            <div className={`chat-message-wrapper ${isMyMessageFlag ? 'chat-message-right' : ''}`}>
              {channel?.type === "team" && client.userID !== message?.user?.id && <span className="sender-name-txt">{message?.user?.name}</span>}
              {message?.type === "deleted" ? <span className="deleted-msg-txt">This message was deleted.</span> : <MessageText />}
            </div>
          }

          {message?.type === "regular" &&
            isMyMessageFlag && (
              <div className="delete-message" onClick={handleDelete}>
                <DeleteIcon />
              </div>
            )}
        </div>
        {message.attachments && (
          <Attachment attachments={message.attachments} />
        )}
        <div
          className={`${
            isMyMessageFlag
              ? "message-bottom_user"
              : "message-bottom_friends"
          } ${channel.type === 'team' ? 'timestmp-padding-team' : 'timestmp-padding-message'}`}
        >
          <div className="message-header-timestamp">
            <MessageTimestamp format="hh:mm" />
          </div>
          {message?.type === "regular" &&
            isMyMessageFlag &&
            (message?.status === "received" && channel?.data?.member_count - 1 === filteredReadBy.length) && <ReceivedIcon />}
          {message?.type === "regular" &&
            isMyMessageFlag &&
            (message?.status === "sending" || channel?.data?.member_count - 1 > filteredReadBy.length) && <SentIcon />}
          {message?.type === "regular" &&
            client.userID !== message?.user?.id && (
              <MessageOptions
                ReactionIcon={EmojiIcon}
                messageWrapperRef={messageWrapperRef}
              />
            )}
          <MessageRepliesCountButton reply_count={message.reply_count} />
        </div>
      </div>
    </div>
  );
};
