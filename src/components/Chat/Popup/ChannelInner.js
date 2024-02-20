import React, { useEffect } from "react";
import {
  MessageList,
  MessageInput,
  Thread,
  Window,
  useChannelStateContext,
  useChatContext
} from "stream-chat-react";

import { useSelector } from "react-redux";
import CustomMessage from "./CustomMessage";
import CustomMessageInput from "./CustomMessageInput";
import MemberList from "../Group/MemberList";

const ChannelInner = () => {
  const { channel } = useChannelStateContext();
  const { setActiveChannel } = useChatContext()
  const { showMemberList, updateTimestamp } = useSelector((state) => state.chat);

  useEffect(() => {
    setActiveChannel(channel)
  }, [channel, updateTimestamp]);

  return (
    <div className="popup-chat__channel-inner">
      <Window>
        {showMemberList ? (
          <MemberList />
        ) : (
          <>
            <MessageList Message={CustomMessage} returnAllReadData={true} />
            <MessageInput Input={CustomMessageInput} />
          </>
        )}
      </Window>
      <Thread />
    </div>
  );
};

export default ChannelInner;
