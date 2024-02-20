import React, { useEffect } from "react";
import {
  MessageList,
  MessageInput,
  Thread,
  Window,
  useChannelStateContext,
} from "stream-chat-react";

import { useDispatch, useSelector } from "react-redux";
import { setActiveChannel } from "../../../redux/chatSlice";
import CustomMessage from "./CustomMessage";
import CustomMessageInput from "./CustomMessageInput";
import MemberList from "../Group/MemberList";

const ChannelInner = () => {
  const { channel } = useChannelStateContext()
  const dispatch = useDispatch()
  const { showMemberList, updateTimestamp } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(setActiveChannel(channel))
  }, [channel, updateTimestamp])

  return (
    <div className="chat__channel-inner">
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
  )
};

export default ChannelInner;
