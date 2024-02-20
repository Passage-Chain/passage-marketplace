import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ReactSVG } from "react-svg";
import follow from "../../../assets/images/follow.svg";
import followers from "../../../assets/images/followers.svg";
import connections from "../../../assets/images/connection_icon.svg";
import { classForBadge } from "../../utils/CommonFunctions/commonfunctions";
import events from "../../../assets/images/events_icon.svg";
import myCollection from "../../../assets/images/my_collection_icon.svg";
import setting from "../../../assets/images/setting_icon.svg";
import logOut from "../../../assets/images/logout_icon.svg";
import { useSelector } from "react-redux";
import "./logoutSettingPanel.scss";
import Toast from "../../custom/CustomToast";
import { useDispatch } from "react-redux";
import { clean } from "../../../redux/accountSlice";
import feedService from "../../../services/Feed";
import extend from "../../../assets/images/extend.svg"
import { FEED_USER_TYPES } from "src/utils/globalConstant";

const LogoutSettingPanel = () => {
  const history = useHistory();
  const dispatch = useDispatch()
  const account = useSelector((state) => state.account);
  const [data, setData] = useState([]);
  const [counts, setCounts] = useState([]);
  const [badgesList, setbadgesList] = useState([]);
  const [isBadgeExpanded, setisBadgeExpanded] = useState(false);

  const tagscolors = [
    "#78BAD6", "#FFDBA6", "#F28F38", "#78BAD6", "#FFDBA6", "#F28F38","#78BAD6", "#FFDBA6", "#F28F38", "#78BAD6", "#FFDBA6", "#F28F38",
    "#78BAD6", "#FFDBA6", "#F28F38", "#78BAD6", "#FFDBA6", "#F28F38","#78BAD6", "#FFDBA6", "#F28F38", "#78BAD6", "#FFDBA6", "#F28F38",
    "#78BAD6", "#FFDBA6", "#F28F38", "#78BAD6", "#FFDBA6", "#F28F38","#78BAD6", "#FFDBA6", "#F28F38", "#78BAD6", "#FFDBA6", "#F28F38",
    "#78BAD6", "#FFDBA6", "#F28F38", "#78BAD6", "#FFDBA6", "#F28F38","#78BAD6", "#FFDBA6", "#F28F38", "#78BAD6", "#FFDBA6", "#F28F38",
    "#78BAD6", "#FFDBA6", "#F28F38", "#78BAD6", "#FFDBA6", "#F28F38","#78BAD6", "#FFDBA6", "#F28F38", "#78BAD6", "#FFDBA6", "#F28F38",
    "#78BAD6", "#FFDBA6", "#F28F38", "#78BAD6", "#FFDBA6", "#F28F38","#78BAD6", "#FFDBA6", "#F28F38", "#78BAD6", "#FFDBA6", "#F28F38"
 ];

 const expandBadgeDiv=()=>{
  setisBadgeExpanded(true);
}
  const removeCurrentNotification = (e) => {
    console.log('notification ', e);
    //const itemPos = data.findIndex(item => item.notificationId === e.notificationId);
    const updatedData = data.filter((x) => x.notificationId !== e.notificationId);
    setData(updatedData)
  }
  const redirectToLogOut = () => {
    dispatch(clean())
    localStorage.setItem('token', null);
    history.push("/login");
    Toast.success('Logout Successful', 'You have successfully logged out.');

  }
  const redirectToProfile = () => {
    history.push("/feeds",{usertype: FEED_USER_TYPES.SELF});
  }

  const redirectToUserSettings = () => {
    history.push("/user-settings");
  }
  // history.push("/app/Notification");
  const handleFollowCount=async()=>{
    try {
      const response = await feedService.followCount(account.token,account.id);
      setCounts(response?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleuserBadges=async()=>{
      try {
        const response = await feedService.allUserBadges(account.token,account.id);
        setbadgesList(response?.data);
        //setCounts(response?.data);
      } catch (error) {
        console.log(error);
      }
    };
    useEffect(() => {
      handleFollowCount();
      handleuserBadges();
    }, []);
  return (
    <>
      <div className={isBadgeExpanded==true?"setting_panel":"setting_panel minimum-height"}>
        <button className="auth-button profile-button" onClick={redirectToProfile}>PROFILE</button>
        <div className="popup_section">
          <span><ReactSVG src={follow} className="display_inline"></ReactSVG> <span className="mr-30">{counts.following}</span></span>
          <span><ReactSVG src={followers} className="display_inline"></ReactSVG> <span className="mr-30">{counts.followers}</span></span>
          <span><ReactSVG src={connections} className="display_inline"></ReactSVG><span>{counts.friends}</span></span>
        </div>
        <span className="mt-10 popup_section">
        <div className={isBadgeExpanded?"badges":"badges-with-maxmumheight"}>
          <div className="badge-tags ">
            {(!isBadgeExpanded)&&(badgesList.map((tag, index) => (
              index<5&&<span key={index} className={`bdg2 badgetag-wrapper ${classForBadge(tag.badge.badgeName)}`}>
                <img className="badge_image" src={tag?.badge?.image} alt={tag?.badge?.badgeName} />
                <span className="tbadgeag-label">
                  {tag.badge.badgeName}
                </span>
              </span>
            )))}
            {(isBadgeExpanded)&&(badgesList.map((tag, index) => (
              <span key={index} className={`bdg2 badgetag-wrapper ${classForBadge(tag.badge.badgeName)}`}>
                <img className="badge_image" src={tag?.badge?.image} alt={tag.badge.badgeName} />
                <span className="tbadgeag-label">
                  {tag.badge.badgeName}
                </span>
              </span>
            )))}
            {badgesList.length>5&&(!isBadgeExpanded)&&(
              <div className="extend">
                <ReactSVG src={extend} onClick={expandBadgeDiv}></ReactSVG>
              </div>)}
          </div>
        </div>
        </span>
        <span className="mt-10 popup_section disabled-cta">
          <ReactSVG src={events} className="display_inline"></ReactSVG> <span className="component_text">Events</span>
        </span>
        <span className="mt-10 popup_section" onClick={() => history.push('/marketplace/my-collection')}>
          <ReactSVG src={myCollection} className="display_inline"></ReactSVG> <span className="component_text">My Collection</span>
        </span>
        <span className="mt-10 popup_section" onClick={redirectToUserSettings}>
          <ReactSVG src={setting} className="display_inline"></ReactSVG> <span className="component_text">Settings</span>
        </span>
        <span className="mt-10 popup_section" onClick={redirectToLogOut}>
          <ReactSVG src={logOut} className="display_inline"></ReactSVG> <span className="component_text">Log Out</span>
        </span>
      </div>
    </>
  );
};

export default LogoutSettingPanel;
