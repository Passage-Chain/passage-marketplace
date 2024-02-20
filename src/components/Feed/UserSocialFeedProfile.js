import { Col } from "antd";
import { ReactSVG } from "react-svg";
import Followingicon from "../../assets/images/Following-icon.svg"
import Followersicon from "../../assets/images/Followers-icon.svg"
import Friendsicon from "../../assets/images/Friends-icon.svg"
import extend from "../../assets/images/extend.svg"
import Avatarimg from "../../assets/images/left_menu_passageLogo.svg";
import Avatar from '../custom/Avatar'
import '../../styles/Feed/SocialFeed.scss'
import { useHistory } from "react-router-dom";
import { Tooltip } from 'antd'
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import feedService from "../../services/Feed";
import { classForBadge } from "../utils/CommonFunctions/commonfunctions";
import { FEED_USER_TYPES } from "src/utils/globalConstant";

const UserSocialFeedProfile = ({ name }) => {
  const history = useHistory();
  const account = useSelector((state) => state.account);
  const [counts, setCounts] = useState([]);
  const [badgesList, setbadgesList] = useState([]);
  const [isBadgeExpanded, setisBadgeExpanded] = useState(false);

  useEffect(() => {
    handleFollowCount();
    handleuserBadges();
  }, []);

  const handleFollowCount = async () => {
    try {
      const response = await feedService.followCount(account.token, account.id);
      setCounts(response?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleuserBadges = async () => {
    try {
      const response = await feedService.allUserBadges(account.token, account.id);
      setbadgesList(response?.data);
      //setCounts(response?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const redirectToProfile = () => {
    history.push("/feeds", { usertype: FEED_USER_TYPES.SELF });
  }
  const expandBadgeDiv = () => {
    setisBadgeExpanded(true);
  }
  return (
    <div className="leftside">
      <div className="UserProfile">
        <div className="headerbg">
          <div className="curvebg">
            <Avatar image={(account.avatar || Avatarimg)} size={40} />
            <div>
              <Col><label className="userlabel">{name}</label></Col>
            </div>
          </div>
        </div>
        <div className={badgesList.length > 0 ? (isBadgeExpanded === true ? "exapand_height content1" : "minimum_height content1") : "content1"}>
          <div className="contentinfo">
            <span className="follower">
              <Tooltip placement="top" title="Following">
                <span className="followinnerdiv">
                  <span className="grpimg"><img src={Followingicon} alt="followingIcon" /></span>
                  <span className="grpimg"><span className="u1txt">{counts.following}</span></span>
                </span>
              </Tooltip>
            </span>
            <span className="follower">
              <Tooltip placement="top" title="Followers">
                <span className="followinnerdiv">
                  <span className="grpimg"><img src={Followersicon} alt="followersIcon" /> </span>
                  <span className="grpimg"><span className="u1txt">{counts.followers}</span></span>
                </span>
              </Tooltip>
            </span>
            <span className="follower">
              <Tooltip placement="top" title="Friends">
                <span className="followinnerdiv">
                  <span className="grpimg"><img className="follow-friend" src={Friendsicon} alt="follow_friend" /></span>
                  <span className="u1txt">{counts.friends}</span>
                </span>
              </Tooltip>
            </span>
          </div>
          <div className={isBadgeExpanded === true ? "badges" : "badges-with-maxmumheight"}>

            <div className="badge-tags ">
              {(!isBadgeExpanded) && (badgesList.map((tag, index) => (
                index < 5 &&
                <span key={index} className={`bdg2 badgetag-wrapper ${classForBadge(tag.badge.badgeName)}`}>
                  <img className="badge_image" src={tag?.badge?.image} alt={tag.badge.badgeName} />
                  <span className="tbadgeag-label">
                    {tag.badge.badgeName}
                  </span>
                </span>
              )))}
              {(isBadgeExpanded) && (badgesList.map((tag, index) => (
                <span key={index} className={`bdg2 badgetag-wrapper ${classForBadge(tag.badge.badgeName)}`}>
                  <img className="badge_image" src={tag?.badge?.image} alt={tag.badge.badgeName} />
                  <span className="tbadgeag-label">
                    {tag.badge.badgeName}
                  </span>
                </span>
              )))}
              {badgesList.length > 5 && (!isBadgeExpanded) && (
                <div className="extend">
                  <ReactSVG src={extend} onClick={expandBadgeDiv}></ReactSVG>
                </div>)}
            </div>
            <div className="prfbuttondiv">
              <button className="prfbutton" onClick={redirectToProfile}>
                <label className="prftxt">Profile</label>
              </button>
            </div>

          </div> </div>
      </div>
    </div>
  )
}
export default UserSocialFeedProfile;
