import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Social from '../../Social-v2';
import FavouriteContainer from '../../Favourite/MinimizedFavoriteContainer';
import Chat from '../../Chat'
import Report from '../../Report';
import { Tooltip } from 'antd'
import { useHistory, useLocation } from "react-router-dom";
import useOnlineUsers from '../../../hooks/useOnlineUsers';

import { ReactComponent as DiscoverIcon } from "../../../assets/images-v2/discover.svg";
import { ReactComponent as ActiveDiscoverIcon } from "../../../assets/images-v2/discover-active.svg";
import { ReactComponent as SocialIcon } from "../../../assets/images-v2/social.svg";
import { ReactComponent as ActiveSocialIcon } from "../../../assets/images-v2/social-active.svg";
import { ReactComponent as ExploreIcon } from "../../../assets/images-v2/explore.svg";
import { ReactComponent as ActiveExploreIcon } from "../../../assets/images-v2/explore-active.svg"
import { ReactComponent as NewMessageIcon } from "../../../assets/images-v2/message_chat_new.svg";
import { ReactComponent as MessageIcon } from "../../../assets/images-v2/message_chat.svg";
import { ReactComponent as PassageLogoIcon } from "../../../assets/images/left_menu_passageLogo.svg";
import { ReactComponent as MyWorldsIcon } from "../../../assets/images-v2/globe-icon.svg";
import { ReactComponent as BugReportIcon } from "../../../assets/images-v2/bug-icon.svg";
import { ReactComponent as MintIcon } from "../../../assets/images-v2/mint.svg";
import { ReactComponent as ActiveMintIcon } from "../../../assets/images-v2/mint-active.svg";
import { ReactComponent as Searchbar } from '../../../assets/images/Searchbar.svg'
import UserDetails from '../../custom/UserDetails';
import './index.scss'
import WorldMenu from '../../World/Menu';
import { setIsDM, setShowChatWindow } from '../../../redux/chatSlice';
import GlobalSearchInput from '../../custom/GlobalSearchInput';
import { FEED_USER_TYPES } from 'src/utils/globalConstant';

const Header = () => {
  const history = useHistory()
  const { isInWorld } = useSelector(state => state.world);

  const gotoHomePage = () => {
    history.push('/discover')
  }

  const gotoWorld = () => {
    history.push('/world')
  }
  const gotoUserProfile = () => {
    history.push("/feeds",{ usertype: FEED_USER_TYPES.SELF });
  }
  return (
    <div className='wl-header'>
      <div><PassageLogoIcon className='passage-logo cursor-pointer' onClick={gotoHomePage} /></div>
      <div className='header-options'>
        { isInWorld && <WorldMenu/> }
        {/* <Searchbar/> */}
        {/* <GlobalSearchInput/> */}
        <FavouriteContainer onClick={gotoWorld}/>
        <UserDetails onClick={gotoUserProfile} />
      </div>
    </div>
  )
}

const SideOptions = () => {
  const [activeOption, setActiveOption] = useState("")
  const location = useLocation()
  const history = useHistory()

  useEffect(() => {
    const routes = ['/discover', '/marketplace', '/social', '/my-worlds', '/mint']
    if (!routes.includes(location?.pathname)) {
      setActiveOption('')
    }
  }, [location?.pathname])

  const gotoExplore = () => {
    history.push('/marketplace')
  }

  const handleDiscoverClick = () => {
    setActiveOption('discover')
    history.push('/discover')
  }

  const handleExploreClick = () => {
    setActiveOption('marketplace')
    gotoExplore();
  }

  const handleSocialClick=()=>{
    setActiveOption('social');
    history.push('/social')
  }

  const handleMyWorldsClick = () => {
    setActiveOption('my-worlds');
    history.push('/my-worlds');
  }

  const handleMintClick = () => {
    setActiveOption('mint');
    history.push('/mint');
  };

  // icon color: rgb(155	156	157)
  return (
    <div className='wso-container'>
      <Tooltip placement="right" title="Discover">
        {activeOption === 'discover' ?
          <ActiveDiscoverIcon /> :
          <DiscoverIcon onClick={handleDiscoverClick}/>
        }
      </Tooltip>
      <Tooltip placement="right" title="Social">
        {activeOption === 'social' ?
          <ActiveSocialIcon /> :
          <SocialIcon onClick={handleSocialClick}/>
        }
      </Tooltip>
      <Tooltip placement="right" title="Mint">
        {activeOption === 'mint' ?
          <ActiveMintIcon style={{ padding: "0 2px" }}/> :
          <MintIcon onClick={handleMintClick} style={{ padding: "0 2px" }}/>
        }
      </Tooltip>

      <Tooltip placement="right" title="Marketplace">
        {activeOption === 'marketplace' ?
          <ActiveExploreIcon /> :
          <ExploreIcon onClick={handleExploreClick}/>
        }
      </Tooltip>
      <Tooltip placement="right" title="My Worlds">
        {activeOption === 'my-worlds' ?
          <MyWorldsIcon className='disabled-cta'/>:
          <MyWorldsIcon className='disabled-cta' onClick={handleMyWorldsClick}/>
        }
      </Tooltip>

    </div>
  )
}

const Message = () => {
  const dispatch = useDispatch()
  const { showChatWindow, unreadCount } = useSelector(state => state.chat)

  const handleMessageClick = () => {
    dispatch(setShowChatWindow(true))
  }

  const handleBugReportClick = () => {
    window.open('https://forms.gle/aXp81j4XSSrZowWt6', '_blank').focus()
  }

  const closeChat = () => {
    dispatch(setShowChatWindow(false))
    dispatch(setIsDM(false))
  }

  return (
    <>
      <Chat onClose={closeChat} show={showChatWindow}/>
      <div className='wco-container'>
        <Tooltip placement="right" title="Messages">
          {unreadCount ?
            <NewMessageIcon className='cursor-pointer' onClick={handleMessageClick}/> :
            <MessageIcon className='cursor-pointer' onClick={handleMessageClick}/>
          }
        </Tooltip>
      </div>
      <div className='wco-container bug-report'>
        <Tooltip placement="right" title="Report a bug">
          <BugReportIcon className='cursor-pointer' onClick={handleBugReportClick} width="16" height="16" style={{ fill: "#fff" }}/>
        </Tooltip>
      </div>
    </>
  )
}

const WorldLayout = ({ children }) => {
  const token = useSelector((state) => state.account.token);

  useOnlineUsers()
  return (
    <div className='world-layout-container'>
      <Header />
      <SideOptions />
      { token && <Social /> }
      {children}
      <Message />
      <Report />
    </div>
  )
}

export default WorldLayout
