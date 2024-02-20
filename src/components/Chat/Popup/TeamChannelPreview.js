import React from "react";
import { useSelector } from "react-redux";
import { Badge } from "antd";
import { useChatContext } from "stream-chat-react";
import { CustomAvatar } from "../../custom";
import { ReactComponent as GroupChatIcon } from "../../../assets/images-v2/group-grey-icon.svg";
import { isPastDate, getFormatedDate, getFormatedTime } from "../utils";

import { ReactComponent as MuteIcon } from "../../../assets/images/icon-mute-indicator.svg";
import { ReactComponent as ReceivedIcon } from "../../../assets/images-v2/received-icon.svg";
import { ReactComponent as SentIcon } from "../../../assets/images-v2/sent-icon.svg";

const TeamChannelPreview = ({ channel, setActiveChannel, handlePreviewClick, lastMessage, displayTitle, unread }) => {
  const { channel: activeChannel, client } = useChatContext();
  const type = channel?.type;

  const { updateTimestamp } = useSelector((state) => state.chat);

  const Preview = () => {
    const members = Object.values(channel.state.members).filter(
      ({ user }) => user.id !== client.userID
    );
    const messageText = (
      <>
        {lastMessage?.user?.id === client.userID ? (
          <span style={{ color: "#ffffff" }}>You: </span>
        ) : (
          (channel?.type === 'team' && lastMessage?.user?.name && <span style={{ color: "#ffffff" }}>{lastMessage?.user?.name}: </span>)
        )}
        {lastMessage?.text || ""}
      </>
    );

    const handleChannelClick = () => {
      handlePreviewClick()
      setActiveChannel(channel);
    };

    const muteData = channel?.muteStatus();

    return (
      <div className="chat__channel-preview" onClick={handleChannelClick}>
        {type === "team" ? (
          <CustomAvatar
            size={40}
            color="#F28F38"
            name={
              displayTitle
            }
          />
        ) : (
          <Badge
            dot={true}
            color={members[0]?.user?.online ? "green" : "#B7B7B7"}
            size="small"
          >
            <CustomAvatar
              size={40}
              color="#F28F38"
              name={
                displayTitle
              }
              image={members[0]?.user?.profileImage}
            />
          </Badge>
        )}
        <div className="channel-detail">
          <div className="channel-detail-wrapper">
            <div className="channel-detail-block">
              {type === "team" && <GroupChatIcon />}
              <span
                className={
                  channel?.id === activeChannel?.id
                    ? "active-channel-name"
                    : "channel-name"
                }
              >
                {displayTitle}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            {lastMessage?.type === "regular" &&
              client.userID === lastMessage?.user?.id &&
              lastMessage?.status === "received" && <ReceivedIcon />}
            {lastMessage?.type === "regular" &&
              client.userID === lastMessage?.user?.id &&
              lastMessage?.status === "sending" && <SentIcon />}
            <span className="last-message-time">
              {isPastDate(lastMessage?.updated_at)
                ? getFormatedDate(lastMessage?.updated_at)
                : getFormatedTime(lastMessage?.updated_at, false)}
            </span>

            <div key={updateTimestamp}>
              {muteData?.muted ? (
                <div className="mute-icon-wrapper">
                  <MuteIcon />
                </div>
              ) : null}
            </div>
            </div>
          </div>
          <div className="channel-sub-detail">
            <span
              className={
                channel?.id === activeChannel?.id
                  ? "active-last-message"
                  : "last-message"
              }
            >
              {messageText}
            </span>

            {!!unread ? (
              <div className="message-count">{unread}</div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={
        channel?.id === activeChannel?.id ? "chat__active-channel" : ""
      }
    >
      <Preview />
    </div>
  );
};

export default TeamChannelPreview;
