import React, { useRef, useState, useCallback } from "react";
import { ReactComponent as RotateButton } from "../../../assets/images/rotate_avatar_btn.svg";

// import RotateButton from "../../../assets/images/avatar/switch-to-back.png";
// import plusIcon from "../../../assets/images/avatar/plus-icon.png";

function FrontAvatar({
  avatar,
  changeAvatar,
  skins,
  changeMode,
  setActive,
  save,
  closeModal,
}) {
  const resetAvatar = () => {
    changeAvatar({
      skin: "#F54300",
      ring: "#003AFF",
      head: null,
      rightHand: null,
      leftHand: null,
    });
    closeModal(false);
  };

  return (
    <div className='front-avatar'>
      <div className='just-container'>
        <div className='avatar-holder-inner'>
          <div className='hat-container'>
            <img className='hat-img' src={avatar.head?.icon} alt='' />
          </div>
          <div className='left-hand-container'>
            <img src={avatar.leftHand?.icon} alt='' />
          </div>
          <div className='avatar-front'>
            <div
              className='avatar-skin skin'
              style={{ background: avatar?.skin }}
            />
            <div
              className='ring-color'
              style={{ background: avatar?.ring }}
            ></div>
            <img
              className='avatar-image'
              src={avatar?.cameraImage ? avatar.cameraImage : avatar.face?.icon}
            ></img>
          </div>
          <div className='right-hand-container'>
            <img src={avatar.rightHand?.icon} alt='' />
          </div>
        </div>
      </div>
      {/* <div className='avatar-rotate-btn'>
        <RotateButton alt='front' onClick={changeMode} className='switch-icon' />
      </div> */}
      {/* {isOpen && (
        <div
          className='popover'
          ref={popover}
          style={{ left: ring?.clientX, top: ring?.clientY }}
        >
          <HexColorPicker color={avatar?.ring} onChange={changeColor} />
        </div>
      )}
      {!!(isSkinOpen && skins?.length) && (
        <div
          className='skinPopover'
          ref={skinPopover}
          style={{ left: skin?.clientX, top: skin?.clientY }}
        >
          <Row>
            {skins.map((skin, index) => {
              return (
                <Col key={"skin" + index} onClick={() => changeSkin(skin)}>
                  <Image
                    className={
                      "skin-icon " +
                      (avatar.skin?.icon === skin?.icon ? "active" : "")
                    }
                    src={skin?.icon}
                    alt='skin'
                    preview={false}
                  />
                </Col>
              );
            })}
          </Row>
        </div>
      )} */}

      <div className='action'>
        <button className='cancel' onClick={resetAvatar}>
          CANCEL
        </button>
        <button className='save' onClick={save}>
          SAVE CHANGES
        </button>
      </div>
    </div>
  );
}

export default FrontAvatar;
