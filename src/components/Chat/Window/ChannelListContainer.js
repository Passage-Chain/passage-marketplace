import React from "react";
import { ChannelList, useChatContext } from "stream-chat-react";

import TeamChannelList from "./TeamChannelList";
import TeamChannelPreview from "./TeamChannelPreview";

const EmptyChannelList = ({ channelType }) => {
  return (
    <div className="chat__empty-channel-list">
      {/* You have no {channelType === "team" ? 'channel' : "conversation"} currently. */}
    </div>
  )
}

const ChannelListContainer = ({ isLoading }) => {
  const { client } = useChatContext();

  const filters = { members: { $in: [client.userID] } };

  return (
    <div className="chat__channel-list-container">
      <ChannelList
        filters={filters}
        EmptyStateIndicator={EmptyChannelList}
        List={(listProps) => (
          <TeamChannelList
            {...listProps}
          />
        )}
        Preview={(previewProps) => (
          <>
            {!isLoading ? <TeamChannelPreview
              {...previewProps}
            /> : <></>}
          </>
        )}
      />
    </div>
  );
};

export default ChannelListContainer;
