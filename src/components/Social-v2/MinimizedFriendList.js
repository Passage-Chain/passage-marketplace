import React from 'react';
import { Badge, Tooltip } from "antd";
import { CustomAvatar } from '../custom';
import { useHistory } from "react-router-dom";
import { ReactComponent as FriendsIcon } from "../../assets/images-v2/friends.svg"


const Friend = ({ friend, isOnline }) => {
  const history = useHistory();
  const handleUserclick=()=>{
    history.push("/app/index/viewotheruserFeeds", {
      friend: friend,
    })
  }
  return (
    <div className='friend-wrapper'>
      <Tooltip placement="left" title={friend.name}>
        <Badge dot={true} color={isOnline ? 'green' : '#B7B7B7'} size="small">
          <CustomAvatar image={friend.profileImage} size={36} />
        </Badge>
      </Tooltip>
    </div>
  )
}

const MinimizedFriendList = ({ friendList, handleMaximize, onlineUsers }) => {
  return (
    <div className='mini-friend-list-container'>
      <Tooltip
        placement="left"
        title={"Expand"}
      >
        <div className='maximize-icon-wrapper'>
          <FriendsIcon onClick={handleMaximize}/>
        </div>
      </Tooltip>
      <div className='list-wrapper'>
        {friendList.map((friend, index) => {
          const isOnline = onlineUsers.find(user => user.id === friend.friendId)?.online
          return <Friend key={index} friend={friend} isOnline={isOnline}/>
        })}
      </div>
    </div>
  )
}

export default MinimizedFriendList