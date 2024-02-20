import { useState } from 'react';

import './UserSettings.scss';
import PublicProfile from "./PublicProfile";
import Account from "./Account";
import Media from "./Media";
import Notification from "./Notification";
import WalletSetting from './WalletSetting';
import Controls from './Controls';

const UserSetting = () => {

  const [isChildSettingMenu, setChildMenu] = useState("Public Profile");

  const settingItems = [
    { key: 1, icon: '', children: [], label: "Public Profile" },
    { key: 2, icon: '', children: [], label: "Account Settings" },
    { key: 3, icon: '', children: [], label: "Audio and Video" },
    { key: 4, icon: '', children: [], label: "Notifications" },
    { key: 5, icon: '', children: [], label: "Wallet" },
    { key: 6, icon: '', children: [], label: "Controls" }
  ];

  return (
    <div className='settings-container'>
      <div className='s-content-wrapper'>
        <div className='s-right-content-wrapper'>
          <div className='s-treading-container'>
            <h1 className='setting_heading'>Settings</h1>
            {settingItems.map((e) => {
              return (
                <div key={e.label}  >
                  <div className={`setting-button ${isChildSettingMenu === e.label ? 'setting-button-active' : 'setting-button-hover'}`} onClick={() => setChildMenu(e.label)}>{e.label}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          {isChildSettingMenu === "Public Profile" && <PublicProfile />}
          {isChildSettingMenu === "Account Settings" && <Account />}
          {isChildSettingMenu === "Audio and Video" && <Media />}
          {isChildSettingMenu === "Notifications" && <Notification />}
          {isChildSettingMenu === "Wallet" && <WalletSetting />}
          {isChildSettingMenu === "Controls" && <Controls />}
        </div>
      </div>
    </div>
  )
}

export default UserSetting
