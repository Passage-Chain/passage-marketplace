import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { StreamChat } from "stream-chat";
import { setOnlineUsers } from "../redux/chatSlice";
import socialService from "../services/social";
import { getSecretKey } from "../components/Chat/utils";
import { STREAM_API_KEY } from "../configs";
import { useHistory } from 'react-router-dom';

export default function useOnlineUsers() {
  const dispatch = useDispatch()
  const account = useSelector(state => state.account)

  const client = StreamChat.getInstance(STREAM_API_KEY);
  const history = useHistory();

  useEffect(() => {
    if (account.id && account.username) {
      if (!client?._user) {
        const connectUser = async () => {
          try {
            const secretKey = await getSecretKey()
            const res = await client.connectUser({
              id: account.id,
              name: account.username,
            }, secretKey)
          } catch(err) {
            if(err?.response?.status === 401 )
            history.push('/')
          }
        }
        connectUser()
      }
    }

  }, [account.id, account.username])

  useEffect(() => {
    const fetchOnlineUsers = async() => {
      const response = await socialService.getFriendList();
      const friends = response?.data?.result || [];
      try {
        const onlineUsers = await client.queryUsers({
          id: {
            $in: [
              ...friends.map(friend => friend.friendId)
             ]
          }},
          { id: -1 },
          { presence: true }
       );
       dispatch(setOnlineUsers(onlineUsers?.users))
      } catch (error) {

      }
    }

    if (client?._user) {
      fetchOnlineUsers()

      client.on('user.presence.changed', () => {
        fetchOnlineUsers()
      })
    }
  }, [client?._user])

  return null
}
