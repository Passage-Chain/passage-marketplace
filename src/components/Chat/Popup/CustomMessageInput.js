import React, { useEffect } from "react";
import {
  ChatAutoComplete,
  EmojiPicker,
  useMessageInputContext,
  useChatContext
} from "stream-chat-react";

import { ReactComponent as EmojiIcon } from "../../../assets/images/icon-emoji.svg";
import { ReactComponent as SendIcon } from "../../../assets/images/icon-send.svg";

import chatService from '../../../services/chatService'

export default () => {
  const { channel, client } = useChatContext()

  useEffect(() => {
    const elements = document.getElementsByClassName('str-chat__textarea__textarea')
    if (elements.length) {
      elements[0].maxLength = 255
    }
  }, [])

  const {
    closeEmojiPicker,
    emojiPickerIsOpen,
    handleEmojiKeyDown,
    handleSubmit,
    openEmojiPicker,
  } = useMessageInputContext();

  const handleSendMessage = async (event) => {
    handleSubmit(event, { channel_name: channel?.type === 'team' ? `${channel?.data?.name}: ${client?.user?.name}` : client?.user?.name } )
    try {
      const members = Object.values(channel?.state?.members)?.filter(member => member.user_id !== client.userID && !member?.user?.online)
      const payload = { 
        userIds: members.map(member => member?.user_id).join(","),
        content: {
          imageUrl: "",
          onClickUrl: "",
          data: event.target.value,
          notificationType: 'chat',
          chatType: channel?.type,
          sender: channel?.type === 'team' ? `${channel?.data?.name}: ${client?.user?.name}` : client?.user?.name,
          senderId: channel?.type === 'team' ? channel?.cid : client?.userID,
        },
      }
      if (members.length > 0) {
        await chatService.notifiyChatMessage(payload)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="chat__message-input">
      <div className="str-chat__input-flat ">
        <div className="emoji-wrapper">
          <div
            className="emoji"
            onClick={emojiPickerIsOpen ? closeEmojiPicker : openEmojiPicker}
            onKeyDown={handleEmojiKeyDown}
            role="button"
            tabIndex={0}
          >
            <EmojiIcon />
          </div>
          <EmojiPicker className="popup-emoji-picker" small/>
        </div>
      </div>
      <div className="message-text str-chat__input-flat">
        <ChatAutoComplete placeholder="Write a message..." handleSubmit={handleSendMessage}/>
      </div>
      <div className="send-wrapper">
        <div className="send" onClick={handleSendMessage}>
          <SendIcon />
        </div>
      </div>
    </div>
  );
};
