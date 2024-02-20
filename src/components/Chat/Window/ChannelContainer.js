import React from "react";
import { Channel, DateSeparator } from "stream-chat-react";

import ChannelInner from "./ChannelInner";
import { isPastDate, getFormatedDate } from "../utils";

const CustomDateSeparator = (props) => {
  const formatDate = (date) => {
    if (isPastDate(date)) {
      return getFormatedDate(date);
    } else {
      return "Today";
    }
  };
  return <DateSeparator {...props} formatDate={formatDate} position="center" />;
};

const ChannelContainer = ({ isLoading }) => {
  const EmptyState = () => (
    <div className="chat__empty-chat">
      <p className="channel-empty__first">No Chat History</p>
      <p className="channel-empty__second">Start your conversation</p>
    </div>
  );

  return (
    <div className="chat__channel-container">
      <Channel
        DateSeparator={(props) => (
          <CustomDateSeparator {...props} position={"center"} />
        )}
        EmptyStateIndicator={EmptyState}
      >
        {!isLoading ? <ChannelInner /> : <></>}
      </Channel>
    </div>
  );
};

export default ChannelContainer;
