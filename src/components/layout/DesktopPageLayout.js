import { React, useEffect } from "react";
import { Switch, Route, useHistory, useRouteMatch } from "react-router-dom";

import DesktopPage from "../utils/Page/DesktopPage";
import DesktopFriendsPanel from "../shared/FriendsPanel/DesktopFriendsPanel";
import DesktopSettingPanel from "../shared/SettingPanel/DesktopSettingPanel";
import Settings from "../Settings";
import Chat from "../Chat";

import DesktopDashboard from "../../views/DesktopDashboard/DesktopDashboard";
import DesktopMessages from "../../views/DesktopMessages/DesktopMessages";
import DesktopChat from "../shared/Chat/DesktopChat";
import { OmitProps } from "antd/lib/transfer/ListBody";
import { ReactSVG } from "react-svg";
import GlobalChat from "../shared/GlobalChat/GlobalChat";
import loader from "../../assets/images/spin-transparent.svg";
import Social from "../Social";
import FAQ from "../FAQ";
import ContactUs from "../ContactUs";
import WorldLayout from "./World";
import World from "../World";
import Explore from "../Explore";
import Discover from "../Discover";
import FavouritePage from "../Favourite/FavouritePage";
import SocialFeed from "../Feed/SocialFeed";
import ViewUserProfileWithFeeds from "../ViewFeeds/ViewUserProfileWithFeeds";
import UserSetting from "../Settings/UserSettings";
import Conference from "../Conference";
import AcceptRequest from "../Social-v2/AcceptRequest";
export default function DesktopPageLayout({
  onFriendsClick,
  onExitFriendsClick,
  onDashboardClick,
  onExitDashboardClick,
  onMassagesClick,
  onExitMassagesClick,
  onExitChat,
  onExitFAQ,
  onExitContactUs,
  onExitSetting,
  backToMessages,
  isLoading,
  setLoading,
}) {
  useEffect(() => {});
  return (
    <WorldLayout>
      <Switch>
        <Route exact path={`/app/index/world`}>
          <World />
        </Route>
        <Route exact path={`/app/index/discover`}>
          <Discover />
        </Route>
        <Route exact path={`/app/index/marketplace`}>
          <Explore />
        </Route>
        <Route exact path={`/app/index/favourites`}>
          <FavouritePage />
        </Route>
        <Route exact path={`/app/index/social`}>
          <SocialFeed />
        </Route>
        <Route exact path={`/app/index/viewfeeds`}>
          <ViewUserProfileWithFeeds usertype={"S"} />
        </Route>
        <Route exact path={`/app/index/viewownerFeeds`}>
          <ViewUserProfileWithFeeds usertype={"O"} />
        </Route>
        <Route exact path={`/app/index/viewotheruserFeeds`}>
          <ViewUserProfileWithFeeds usertype={"OU"} />
        </Route>
        <Route exact path={`/app/index/accept-request/:hash`}>
          <AcceptRequest />
        </Route>
        {/* <Route exact path={`/app/index/settings`}>
          <Settings onExitSetting={onExitSetting} />
        </Route> */}
        <Route exact path={`/app/index/user-settings`}>
          <UserSetting />
        </Route>
        <Route exact path={`/app/index/dashboard`}>
          <div
            style={{
              position: "fixed",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              padding: 0,
            }}
          >
            <DesktopDashboard
              onDashboardClick={onDashboardClick}
              onExitDashboardClick={onExitDashboardClick}
            />
          </div>
        </Route>
        <Route exact path={`/app/index/messages`}>
          <Chat onExitMassagesClick={onExitMassagesClick} />
        </Route>
        <Route exact path={`/app/index/faq`}>
          <FAQ onExitFAQ={onExitFAQ} />
        </Route>
        <Route exact path={`/app/index/contact-us`}>
          <ContactUs onExit={onExitContactUs} />
        </Route>
        <Route exact path={`/app/index/conference`}>
          <Conference />
        </Route>
        {/* <Route exact path={`/app/index/global-chat`}>
          <div
            style={{
              position: "fixed",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              background: "gray",
              opacity: "0.5",
            }}
          ></div>
          <div
            style={{
              position: "fixed",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              padding: 5,
            }}
          >
            <GlobalChat
              backToMessages={backToMessages}
              onExitChat={onExitChat}
            />
          </div>
        </Route> */}
      </Switch>
    </WorldLayout>
  );
}
