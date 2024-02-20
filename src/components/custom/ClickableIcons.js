import React from 'react';
import './index.scss'

const ClickableIcons = ({ icon }) => {
  return (
    <div className='clickable-icon-container'>
      {icon}
    </div>
  )
}

export default ClickableIcons