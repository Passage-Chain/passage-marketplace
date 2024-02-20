import { useEffect, useState } from "react";

import { Tooltip } from "antd";
import { useHistory, useLocation } from "react-router-dom";

import { ReactComponent as ExploreIcon } from "../../../assets/images-v2/explore.svg";
import { ReactComponent as ActiveExploreIcon } from "../../../assets/images-v2/explore-active.svg";
import { ReactComponent as PassageLogoIcon } from "../../../assets/images/left_menu_passageLogo.svg";
import { ReactComponent as MyWorldsIcon } from "../../../assets/images-v2/globe-icon.svg";
import { ReactComponent as BugReportIcon } from "../../../assets/images-v2/bug-icon.svg";
import { ReactComponent as MintIcon } from "../../../assets/images-v2/mint.svg";
import { ReactComponent as ActiveMintIcon } from "../../../assets/images-v2/mint-active.svg";
import UserDetails from "../../custom/UserDetails";
import "./index.scss";

import { FEED_USER_TYPES } from "src/utils/globalConstant";

const Header = () => {
  const history = useHistory();

  const gotoHomePage = () => {
    history.push("/discover");
  };

  const gotoUserProfile = () => {
    history.push("/feeds", { usertype: FEED_USER_TYPES.SELF });
  };
  return (
    <div className="wl-header">
      <div>
        <PassageLogoIcon
          className="passage-logo cursor-pointer"
          onClick={gotoHomePage}
        />
      </div>
      <div className="header-options">
        <UserDetails onClick={gotoUserProfile} />
      </div>
    </div>
  );
};

const SideOptions = () => {
  const [activeOption, setActiveOption] = useState("");
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const routes = [
      "/discover",
      "/marketplace",
      "/social",
      "/my-worlds",
      "/mint",
    ];
    if (!routes.includes(location?.pathname)) {
      setActiveOption("");
    }
  }, [location?.pathname]);

  const gotoExplore = () => {
    history.push("/marketplace");
  };

  const handleExploreClick = () => {
    setActiveOption("marketplace");
    gotoExplore();
  };

  const handleMyWorldsClick = () => {
    setActiveOption("my-worlds");
    history.push("/my-worlds");
  };

  const handleMintClick = () => {
    setActiveOption("mint");
    history.push("/mint");
  };

  // icon color: rgb(155	156	157)
  return (
    <div className="wso-container">
      <Tooltip placement="right" title="Mint">
        {activeOption === "mint" ? (
          <ActiveMintIcon style={{ padding: "0 2px" }} />
        ) : (
          <MintIcon onClick={handleMintClick} style={{ padding: "0 2px" }} />
        )}
      </Tooltip>

      <Tooltip placement="right" title="Marketplace">
        {activeOption === "marketplace" ? (
          <ActiveExploreIcon />
        ) : (
          <ExploreIcon onClick={handleExploreClick} />
        )}
      </Tooltip>
      <Tooltip placement="right" title="My Worlds">
        {activeOption === "my-worlds" ? (
          <MyWorldsIcon className="disabled-cta" />
        ) : (
          <MyWorldsIcon
            className="disabled-cta"
            onClick={handleMyWorldsClick}
          />
        )}
      </Tooltip>
    </div>
  );
};

const Message = () => {
  const handleBugReportClick = () => {
    window.open("https://forms.gle/aXp81j4XSSrZowWt6", "_blank").focus();
  };

  return (
    <>
      <div className="wco-container bug-report">
        <Tooltip placement="right" title="Report a bug">
          <BugReportIcon
            className="cursor-pointer"
            onClick={handleBugReportClick}
            width="16"
            height="16"
            style={{ fill: "#fff" }}
          />
        </Tooltip>
      </div>
    </>
  );
};

const WorldLayout = ({ children }) => {
  return (
    <div className="world-layout-container">
      <Header />
      <SideOptions />
      {children}
      <Message />
    </div>
  );
};

export default WorldLayout;
