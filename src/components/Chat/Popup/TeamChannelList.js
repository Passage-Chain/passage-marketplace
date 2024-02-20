import React, { useState } from "react";

const TeamChannelList = ({ children, error = false, loading, type }) => {
  const [open, setOpen] = useState(true)

  const toggleOpen = () => {
    setOpen(!open)
  }
  return (
    <div className="popup-chat__team-channel-list">
      {/* <header>
        <Tooltip placement="right" title={type === 'team' ? 'Channels' : 'Direct Messages' }>
          <div className="header-left">
            {type === 'team' ? <ChannelIcon /> : <MessageIcon />}
          </div>
        </Tooltip>
        <ArrowDownIcon className="cursor-pointer" onClick={toggleOpen} />
      </header> */}
      <body className={open ? "list-open" : "list-close"}>
        {children}
      </body>
    </div>
  )
};

export default TeamChannelList;
