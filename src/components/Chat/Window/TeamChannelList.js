import React, { useState } from "react";

const TeamChannelList = ({ children }) => {
  const [open, setOpen] = useState(true)

  const toggleOpen = () => {
    setOpen(!open)
  }

  return (
    <div className="chat__team-channel-list">
      <body className={open ? "list-open" : "list-close"}>
        {children}
      </body>
    </div>
  )
};

export default TeamChannelList;
