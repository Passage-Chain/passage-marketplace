import { useState } from "react";

const MyWorlds = () => {
  const [worlds, setWorlds] = useState([]);

  return (
    <div className='discover-container'>
      <div className='d-header'>
        <span className='d-header-label'>My Worlds</span>
      </div>
      <div className='d-subheader'>
        <div className='d-main-tags-wrapper'></div>
      </div>

      <div className='d-content-wrapper'>
        <div className='d-right-content-wrapper'>
          <div className='no-world-txt'>Coming Soon...</div>
        </div>
      </div>
    </div>

  )
}
export default MyWorlds
