import "./styles/index.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import { useEffect, useState } from "react";

import Login from "./views/Log In/LogIn";

import {
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Registration from "./views/Registration/Registration";
import ResetPassword from "./views/ResetPassword/ResetPassword";
import GuardedRoute from "./components/utils/GuardedRoute";

import settingService from "./services/settings";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { useDispatch, useSelector } from "react-redux";
import { setId, setUsername, setEmail } from "./redux/accountSlice";

import useWhoami from "./hooks/useWhoami";

import useAgora from "./hooks/useAgora";
//import useFriendsChats from "./hooks/useFriendsChats";
import { initiateChat } from "./utils/configChat";

import { NotificationContainer } from "./components/utils/Notification";
import { InitialSetupAV } from "./components/InitialSetup";

// import ReactGA from 'react-ga';
// ReactGA.initialize('G-5195ETT3XK');
import { googleAnalyticsActions } from "./utils/googleAnalyticsInit";
import Discover from "./components/Discover";
import NftDetails from "./components/Explore/NftDetails";
import Explore from "./components/Explore";
import World from "./components/World";
import FavouritePage from "./components/Favourite/FavouritePage";
import SocialFeed from "./components/Feed/SocialFeed";
import ViewUserProfileWithFeeds from "./components/ViewFeeds/ViewUserProfileWithFeeds";
import AcceptRequest from "./components/Social-v2/AcceptRequest";
import UserSetting from "./components/Settings/UserSettings";
import DesktopDashboard from "./views/DesktopDashboard/DesktopDashboard";
import Conference from "./components/Conference";
import FAQ from "./components/FAQ";
import ContactUs from "./components/ContactUs";
import MyWorlds from "./components/MyWorlds";
import Mints from "./components/Mint";
import Mint from "./components/Mint/Mint.js";

// a suite of utilities for superusers to monitor the application and intervene
import "./utils/passageDevTools";

function App() {
  const dispatch = useDispatch();

  function handleResize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  useWhoami();
  useAgora();

  const screens = useBreakpoint();
  const [dataChannelInited, setDataChannelInited] = useState(false);
  handleResize();
  const account = useSelector((state) => state.account);

  useEffect(() => {
    fetchUserDetails();
    googleAnalyticsActions.initGoogleAnalytics("UA-262724853-1");
  }, []);

  //   useEffect(() => {
  //     ReactGA.pageview(window.location.pathname + window.location.search);
  // }, []);

  useEffect(() => {
    async function fetchData() {
      if (account.id && account.username) {
        await initiateChat(account);
      }
    }
    fetchData();
  }, [account.id, account.username]);

  useEffect(() => {
    console.debug("dataChannelInited:", dataChannelInited);
  }, [dataChannelInited]);

  useEffect(() => {
    if (!screens.md) window.addEventListener("resize", handleResize);
    return () => {
      if (!screens.md) window.removeEventListener("resize", handleResize);
    };
  });

  const fetchUserDetails = async () => {
    try {
      const response = await settingService.getUserDetails();
      dispatch(setId(response.data.id));
      dispatch(setUsername(response.data.nickname));
      dispatch(setEmail(response.data.email));
    } catch (error) {
      console.log("error", error.response.data.message);
    }
  };

  return (
    <div id="app" className="App">
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/registration" component={Registration} />
        <Route
          exact
          path="/reset-password"
          component={ResetPassword}
          authRequired={false}
        />
        <Switch>
          <GuardedRoute path="/initial-setup" component={InitialSetupAV} />
          <GuardedRoute path={"/discover"} component={Discover} />
          <GuardedRoute path="/world/:id" component={World} />
          <GuardedRoute
            exact
            path="/marketplace"
            component={Explore}
            myCollection={false}
            authRequired={false}
          />
          <GuardedRoute
            exact
            path="/marketplace/my-collection"
            component={Explore}
            myCollection={true}
            authRequired={false}
          />
          <GuardedRoute
            path="/marketplace/:baseContract/:id"
            component={NftDetails}
            authRequired={false}
          />
          <GuardedRoute path="/favourites" component={FavouritePage} />
          <GuardedRoute path="/social" component={SocialFeed} />
          <GuardedRoute path="/feeds" component={ViewUserProfileWithFeeds} />
          <GuardedRoute
            path="/accept-request/:hash"
            component={AcceptRequest}
          />
          <GuardedRoute path="/user-settings" component={UserSetting} />
          <GuardedRoute path="/dashboard" component={DesktopDashboard} />
          <GuardedRoute path="/conference" component={Conference} />
          <GuardedRoute path="/faq" component={FAQ} />
          <GuardedRoute path="/contact-us" component={ContactUs} />
          <GuardedRoute path="/my-worlds" component={MyWorlds} />
          <GuardedRoute
            exact path="/mint"
            component={Mints}
            authRequired={false}
          />
          <GuardedRoute
            path="/mint/:mintContract"
            component={Mint}
            authRequired={false}
          />
          <Route path="*">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </Switch>
      <ToastContainer
        position="bottom-right"
        hideProgressBar={true}
        theme="dark"
        autoClose={5000}
      />
      <NotificationContainer />
    </div>
  );
}

export default App;
