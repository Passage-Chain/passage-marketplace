import { React, useEffect, useState } from "react";
import { Switch, Route, useHistory, useRouteMatch } from "react-router-dom";

import DesktopPageLayout from "./DesktopPageLayout";
import loader from "../../assets/images/spin-transparent.svg";
import { ReactSVG } from "react-svg";

export default function AppUIContainer() {
  const [scaleCount, setCount] = useState(0);

  const history = useHistory();
  let { path, url } = useRouteMatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div style={{ position: "relative" }} id="mobile-fix">
      {loading ? (
        <div className="center" style={{ zIndex: "9999" }}>
          <ReactSVG src={loader}></ReactSVG>
        </div>
      ) : (
        <Switch>
          <Route path={`${path}`}>
            <DesktopPageLayout
              onFriendsClick={() => {
                history.push("/app/index/friends");
              }}
              onExitFriendsClick={() => {
                history.push("/app/index");
              }}
              onDashboardClick={() => {
                history.push("/app/index/dashboard");
              }}
              onExitDashboardClick={() => {
                history.push("/app/index");
              }}
              onMassagesClick={() => {
                history.push("/app/index/messages");
              }}
              onExitMassagesClick={() => {
                history.push("/app/index");
              }}
              onCustomizationClick={() => {
                history.push("/app/customization");
              }}
              onExitCustomizationClick={() => {
                history.push("/app/index");
              }}
              onExitChat={() => {
                history.push("/app/index");
              }}
              onExitFAQ={() => {
                history.push("/app/index");
              }}
              onExitContactUs={() => {
                history.push("/app/index")
              }}
              onExitSetting={() => {
                history.push("/app/index");
              }}
              setLoading={setLoading}
              backToMessages={() => {
                history.push("/app/index/messages");
              }}
            ></DesktopPageLayout>
            )}
          </Route>
        </Switch>
      )}
      ;
    </div>
  );
}
