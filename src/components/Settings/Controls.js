import React, { useEffect, useState } from 'react';
import accountServices from "../../services/settings";
import Notify from "../utils/Notification/notify";

import { ReactComponent as WASDKeyIcon } from "../../assets/images/icon-wasd.svg"
import { ReactComponent as NavigationTouchIcon } from "../../assets/images/icon-navigation-touch.svg"
import { useHistory } from 'react-router-dom';

const OptionRadio = ({ label, onClick, isActive }) => {
  return (
    <div className='option-radio-wrapper' onClick={onClick}>
      <div className={isActive ? 'option-radio-active' : 'option-radio'}>
        {isActive ? <div className='option-radio-active-inner-circle'></div> : null}
      </div>
      <span className='option-radio-label'>{label}</span>
    </div>
  )
}

const Controls = () => {
  const [controlData, setControlData] = useState(undefined)
  const [navigationByKeys, setNavigationByKeys] = useState(undefined)
  const [navigationByTouch, setNavigationByTouch] = useState(undefined)
  const history = useHistory();

  useEffect(() => {
    fetchControlData();
  }, []);

  useEffect(() => {
    if (controlData) {
      setNavigationByKeys(controlData?.navigationByKeys)
      setNavigationByTouch(controlData?.navigationByTouch)
    }
  }, [controlData])

  useEffect(() => {
    if (navigationByKeys !== undefined && navigationByTouch !== undefined)
    updateControl()
  }, [navigationByKeys, navigationByTouch])

  const fetchControlData = async () => {
    try {
      const response = await accountServices.getControlData();
      setControlData(response.data?.controlData);
      setNavigationByKeys(response.data?.nickname);
    } catch (err) {
      if(err.response.status === 401 )
            history.push('/')
    }
  };

  const handleNavigateByKeysSelect = () => {
    setNavigationByKeys(true)
    setNavigationByTouch(false)
  }

  const handleNavigateByTouchSelect = () => {
    setNavigationByTouch(true)
    setNavigationByKeys(false)
  }

  const updateControl = async () => {
    try {
      const payload = {
        controls: {
          navigationByKeys,
          navigationByTouch
        }
      };
      const response = await accountServices.updateControlData(payload);
    } catch (err) {
      if(err.response.status === 401 )
            history.push('/')
    }
  };

  return (
    <div className='controls__container'>
      <div className='controls__header-wrapper'>
        <div className='controls__header'>CONTROLS</div>
        <div className='controls__subheader'>Choose the controls that are convenient for you.</div>
      </div>

      <div className='controls__body'>
        <div className='controls__option-wrapper'>
          <OptionRadio onClick={handleNavigateByKeysSelect} label="Navigation on the WASD keys" isActive={navigationByKeys} />
          <WASDKeyIcon />
        </div>

        <div className='controls__option-wrapper'>
          <OptionRadio onClick={handleNavigateByTouchSelect} label="Navigation by touch" isActive={navigationByTouch} />
          <NavigationTouchIcon />
        </div>
      </div>
    </div>
  )
}

export default Controls