import React from "react";
import { ChannelList, useChatContext } from "stream-chat-react";

import TeamChannelList from "./TeamChannelList";
import TeamChannelPreview from "./TeamChannelPreview";

// const customChannelTeamFilter = (channels) => {
//   return channels.filter((channel) => channel.type === 'team');
// }

// const customChannelMessagingFilter = (channels) => {
//   return channels.filter((channel) => channel.type === 'messaging');
// }

const EmptyChannelList = ({ channelType }) => {
  return ""
}

const ChannelListContainer = ({ isLoading, handlePreviewClick }) => {
  const { client } = useChatContext();

  const filters = { members: { $in: [client.userID] } };

  return (
    <div className="popup-chat__channel-list-container">
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
              handlePreviewClick={handlePreviewClick}
            /> : <></>}
          </>
        )}
      />
    </div>
  );
};

export default ChannelListContainer;
