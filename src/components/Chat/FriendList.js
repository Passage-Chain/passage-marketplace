import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Badge, Popover, Tooltip } from "antd";
import { CustomAvatar } from '../custom';
import { setAccused, setShowReportUserModal } from "../../redux/reportSlice";

const Menu = ({ handleHide, handleReportUserClick }) => {
  return (
    <div className="menu__container">
      <div 
        className="menu" 
        onClick={() => {
          handleHide();
          handleReportUserClick();
        }}
      >
        Report User
      </div>
    </div>
  );
};

const Friend = ({ friend, isOnline, handleReportUserClick }) => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  const handleHidePopover = () => {
    setIsPopoverVisible(false);
  };
  
  const handleVisibleChange = (visible) => {
    setIsPopoverVisible(visible);
  };
  return (
    <div className='friend-wrapper'>
      <Tooltip placement="left" title={friend?.user?.name}>
        <Popover
          placement="bottomRight"
          visible={isPopoverVisible}
          onVisibleChange={handleVisibleChange}
          content={
            <Menu
              handleHide={handleHidePopover}
              handleReportUserClick={handleReportUserClick}
            />
          }
          trigger="click"
        >
        <Badge dot={true} color={isOnline ? 'green' : '#B7B7B7'} size="small">
          <CustomAvatar name={friend?.user?.name} image={friend?.user?.profileImage} size={36} />
        </Badge>
        </Popover>
      </Tooltip>
    </div>
  );
};

const FriendList = ({ friendList, style = {} }) => {
  const dispatch = useDispatch()

  const handleReportUserClick = (friend) => {
    const accused = {
      friendId: friend?.user?.id
    }
    dispatch(setAccused(accused))
    dispatch(setShowReportUserModal(true))
  }

  return (
    <div className='chat-friend-list-container' style={{ ...style }}>
      <div className='list-wrapper'>
        {friendList.map((friend, index) => {
          const isOnline = friend?.user?.online
          return <Friend key={index} friend={friend} isOnline={isOnline} handleReportUserClick={() =>handleReportUserClick(friend)}/>
        })}
      </div>
    </div>
  )
}

export default FriendList