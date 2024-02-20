import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useChatContext } from "stream-chat-react";
import { useSelector } from "react-redux";
import { getSecretKey } from "./utils";
import { setChatMessage } from '../../redux/chatSlice';
import chatService from '../../services/chatService'

const ChatWrapper = ({
  children,
  setIsLoading,
  setChannelName
}) => {
  const { client, channel, setActiveChannel } = useChatContext();
  const dispatch = useDispatch()
  const { chatUserId, chatMessage, dmTimestamp, chatType } = useSelector(state => state.chat)

  useEffect(() => {
    const members = Object.values(channel?.state?.members || {}).filter(
      ({ user }) => user.id !== client.userID
    );
    const channelName =
    channel?.type === "team"
      ? channel?.data?.name
      : members[0]?.user?.name || "";

    setChannelName(channelName)
  }, [channel])

  useEffect(() => {
    if (chatUserId) {
      createChannel(chatUserId);
    }
  }, [chatUserId, dmTimestamp, chatType]);

  const createChannel = async (chatUserId) => {
    // setIsLoading(true);
    try {
      const secretKey = await getSecretKey();

      if (chatType === 'team') {
        // if user clicks on notification and it's a group message
        const channels = await client.queryChannels(
          { cid: chatUserId },
          { last_message_at: -1 }
        );

        if (channels[0]) {
          await channels[0].watch();
          setActiveChannel(channels[0]);
        }
      } else {
        // if user clicks on notification and it's an individual message
        const newChannel = await client.channel(
          "messaging",
          "",
          {
            name: "",
            members: [client.userID, chatUserId],
          },
          secretKey
        );

  
        await newChannel.watch();
        setActiveChannel(newChannel);

        setIsLoading(false);
  
        // if message is sent front friend list using friend detail popup
        if (chatMessage) {
          await newChannel.sendMessage({ text: chatMessage })
          dispatch(setChatMessage(''))
  
          try {
            const members = Object.values(newChannel?.state?.members)?.filter(member => member?.user_id !== client.userID && !member?.user?.online)
            const payload = { 
              userIds: members.map(member => member?.user_id).join(", "),
              content: {
                imageUrl: "",
                onClickUrl: "",
                data: chatMessage,
                notificationType: 'chat',
                sender: client?.user?.name,
              },
            }
            if (members.length > 0) {
              await chatService.notifiyChatMessage(payload)
            }
          } catch (error) {
            console.log(error)
          }
        } 
      }
    } catch (err) {
      console.log(err)
    }
    setIsLoading(false);
  };

  return (
    <>
      {children}
    </>
  )
}

export default ChatWrapper