import "./styles/index.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import { useEffect } from "react";

import Login from "./views/Log In/LogIn";

import { Routes, Route } from "react-router-dom";

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
      <Routes>
        <Route
          path="/"
          element={
            <GuardedRoute
              component={Explore}
              myCollection={false}
              authRequired={false}
            />
          }
        />
        <Route
          path="/marketplace/my-collection"
          element={
            <GuardedRoute
              component={Explore}
              myCollection={true}
              authRequired={false}
            />
          }
        />
        <Route
          path="/marketplace/:baseContract/:id"
          element={<GuardedRoute component={NftDetails} authRequired={false} />}
        />
        <Route
          path="/mint"
          element={<GuardedRoute component={Mints} authRequired={false} />}
        />
        <Route
          path="/mint/:mintContract"
          element={<GuardedRoute component={Mint} authRequired={false} />}
        />
      </Routes>
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
