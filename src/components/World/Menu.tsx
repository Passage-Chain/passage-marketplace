import { ReactComponent as MenuIcon } from '../../assets/images-v2/globe-menu-icon.svg';
import { useState } from 'react';
import GameModal from '../shared/GameModal';
import { Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setIsInWorld } from '../../redux/worldSlice';
import { World as IWorld, RootState } from '../../../_types/types';

// Menu for displaying world controls
const WorldMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [worldMode, setWorldMode] = useState('Game Mode');
  const { isInWorld } = useSelector((state: RootState) => state.world);
  const dispatch = useDispatch();

  const showMenu = () => {
    setIsOpen(!isOpen);
  }

  const showConfirmationModal = (newValue) => {
    setIsConfirmOpen(newValue || !isConfirmOpen);
  }

  // TODO
  const doNothing = () => {
  }

  // Close Agora and World connections after user confirmation
  const closeWorldConnection = () => {
    dispatch(setIsInWorld(false));
  }

  return (
    <>
      <MenuIcon
        width="52"
        height="52"
        style={{
          border: "1px solid #fff",
          borderRadius: "50%",
          padding: "12px",
          backgroundColor: "#000",
          cursor: "pointer",
        }}
        onClick={showMenu}
      />
      { isOpen &&
        <>
          <div className="world-menu">
            <div>World Settings</div>
            <div className="subtitle">{worldMode}</div>
            <Button onClick={showConfirmationModal}>Disconnect</Button>
          </div>
          <GameModal
            visible={isConfirmOpen}
            setVisible={showConfirmationModal}
            onCancel={doNothing}
            onConfirm={closeWorldConnection}
            confirmLabel={"Confirm"}
            content={"Closing the session will end the current connection to the world."}
            children={null}
          />
        </>
      }
    </>
  )
}

export default WorldMenu;
