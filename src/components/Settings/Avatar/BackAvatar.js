import React, { useRef, useState, useCallback } from 'react';
import { Image, Col, Row } from 'antd';
import useClickOutside from './lib/useClickOutside';
import switchToFrontIcon from '../../../assets/images/avatar/switch-to-front.png';
// import { ReactComponent as RotateButton } from "../../../assets/images/rotate_avatar_btn.svg";

import backAvatar from '../../../assets/images/avatar/back-avatar.png';

function BackAvatar({ avatar, changeAvatar, backs, changeMode }) {
  const backPopover = useRef();
  const [isBackOpen, showBack] = useState(false);
  const [back, setBack] = useState(null);

  const avatarClick = e => {
    e.stopPropagation();
  };

  const openBack = e => {
    e.stopPropagation();
    setBack(e);
    showBack(true);
  };

  const changeBack = back => {
    changeAvatar({ back: back?.id ? back : null });
    showBack(false);
  };

  const closeBack = useCallback(() => showBack(false), []);
  useClickOutside(backPopover, closeBack);

  return (
    <div className="front-avatar">
      <div className="back" onClick={openBack} style={avatar.back ? { background: 'unset' } : {}}>
        <Image className="avatar-imgs" src={avatar.back?.icon || avatar.skin?.icon || backAvatar} preview={false} />
      </div>
      {/* <RotateButton alt="back" className="switch-icon" onClick={ changeMode } style={{position: 'unset'}} title='Click to switch to Front Avatar'/> */}
      <img src={switchToFrontIcon} alt="back" className="switch-icon" onClick={changeMode} style={{ position: 'unset' }} title="Click to switch to Front Avatar" />
      {!!(isBackOpen && backs?.length) && (
        <div className="skinPopover" ref={backPopover} style={{ left: back?.clientX, top: back?.clientY }}>
          <Row>
            {backs.map((back, index) => {
              return (
                <Col key={'back' + index} onClick={() => changeBack(back)}>
                  <Image className={'skin-icon ' + (avatar.back?.icon === back?.icon ? 'active' : '')} src={back?.icon} alt="back" preview={false} />
                </Col>
              );
            })}
          </Row>
        </div>
      )}
    </div>
  );
}

export default BackAvatar;
