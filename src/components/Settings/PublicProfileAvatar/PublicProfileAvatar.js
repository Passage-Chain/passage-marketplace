import React, { useRef, useState, useCallback } from 'react';
import { ReactComponent as RotateButton } from '../../../assets/images/rotate_avatar_btn.svg';
import "./index.scss"

// import RotateButton from "../../../assets/images/avatar/switch-to-back.png";
// import plusIcon from "../../../assets/images/avatar/plus-icon.png";

function PublicProfileAvatar({ avatar, changeAvatar, skins, changeMode, setActive, save }) {
  const resetAvatar = () => {
    changeAvatar({
      skin: '#F54300',
      ring: '#003AFF',
      head: null,
      rightHand: null,
      leftHand: null
    });
  };

  return (

    <div className='public-profile-avatar'>
      {avatar &&
        <div className="front-avatar">
          <div className="just-container">
            <div className="avatar-holder-inner profile_avatar_holder_inner">
              <div className="avatar-front">
                <div className="avatar-skin skin skin_profile_size" style={{ background: avatar?.skin }} />
                <div className="ring-color ring_profile_size" style={{ background: avatar?.ring }}></div>
                <img className="avatar-image profile_avatar_image" src={avatar?.cameraImage || avatar.face?.icon || avatar} alt="profile_img"></img>
              </div>
            </div>
          </div>
        </div>
      }
    </div>

  );
}

export default PublicProfileAvatar;
