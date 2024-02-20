import "./styles/index.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import { useEffect } from "react";

import Login from "./views/Log In/LogIn";

import { Switch, Route, Redirect } from "react-router-dom";

import GuardedRoute from "./components/utils/GuardedRoute";

import settingService from "./services/settings";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { useDispatch } from "react-redux";
import { setId, setUsername, setEmail } from "./redux/accountSlice";

import useWhoami from "./hooks/useWhoami";

import NftDetails from "./components/Explore/NftDetails";
import Explore from "./components/Explore";
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

  const screens = useBreakpoint();
  handleResize();

  useEffect(() => {
    fetchUserDetails();
  }, []);

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
        <Switch>
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
          <GuardedRoute
            exact
            path="/mint"
            component={Mints}
            authRequired={false}
          />
          <GuardedRoute
            path="/mint/:mintContract"
            component={Mint}
            authRequired={false}
          />
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Switch>
      <ToastContainer
        position="bottom-right"
        hideProgressBar={true}
        theme="dark"
        autoClose={5000}
      />
    </div>
  );
}

export default App;
