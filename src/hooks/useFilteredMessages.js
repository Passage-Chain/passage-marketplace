import React, {useState, useEffect } from "react";
import Toast from '../components/custom/CustomToast'

export default function useFilteredMessages(channel) {
  const [filteredLastMessage, setFilteredLastMessage] = useState({})
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (channel) {
      const messages = channel?.state?.messages || channel?.state?.messageSets[0]?.messages || []
      try {
        setUnreadCount(channel?.state?.unreadCount || 0)
        if (messages.length) {
          const filteredLastMessage = messages[messages.length - 1]
          setFilteredLastMessage(filteredLastMessage)
        }
      } catch(err) {
        console.log(err)
      }

      /*setFilteredMessages(filteredMessages)
      if (messages.length) {
        const filteredLastMessage = messages[messages.length - 1]
        setFilteredLastMessage(filteredLastMessage)
      }*/
    }
  }, [channel?.state?.messages?.length, channel?.state?.messageSets[0]?.messages?.length])

  return { filteredLastMessage, unreadCount }
}
