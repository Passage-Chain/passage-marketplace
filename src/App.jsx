import "./styles/index.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import { useEffect } from "react";

import Login from "./views/Log In/LogIn";

import { Switch, Route, Redirect } from "react-router-dom";

import GuardedRoute from "./components/utils/GuardedRoute";

import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

import NftDetails from "./components/Explore/NftDetails";
import Explore from "./components/Explore";
import Mints from "./components/Mint";
import Mint from "./components/Mint/Mint";

function App() {
  function handleResize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  const screens = useBreakpoint();
  handleResize();
  useEffect(() => {
    if (!screens.md) window.addEventListener("resize", handleResize);
    return () => {
      if (!screens.md) window.removeEventListener("resize", handleResize);
    };
  });
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
