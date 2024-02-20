import React from 'react';
import { CustomAvatar } from '../../custom';
import { useChatContext } from 'stream-chat-react';
import { getSecretKey } from '../utils';

const SearchResult = ({ searchList, setViewMode, VIEW_MODES }) => {
  const { client, setActiveChannel } = useChatContext();

  const createChannel = async (user) => {
    try {
      const secretKey = await getSecretKey();
      const response = await client.queryUsers(
        { id: { $ne: client.userID } },
        { id: 1 },
        { limit: 8 }
      );

      const newChannel = await client.channel(
        "messaging",
        "",
        {
          name: "",
          members: [client.userID, user?.id],
        },
        secretKey
      );

      await newChannel.watch();
      setActiveChannel(newChannel);
      setViewMode(VIEW_MODES.CHANNEL_CONTENT)
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className="popup_search-list-container">
      <div className="amm-list-wrapper">
        {searchList.map((user, index) => (
          <div key={index} className="list-item cursor-pointer" onClick={() => createChannel(user)}>
            <div className="user-name-details">
              <CustomAvatar name={user.nickname} image={user.profileImage} size={36} />
              <span className="user-name">{user.nickname}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchResult