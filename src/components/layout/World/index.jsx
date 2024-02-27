import { useEffect, useState } from "react";

import { Tooltip } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

import ExploreIcon from "../../../assets/images-v2/explore.svg";
import ActiveExploreIcon from "../../../assets/images-v2/explore-active.svg";
import PassageLogoIcon from "../../../assets/images/left_menu_passageLogo.svg";
import MintIcon from "../../../assets/images-v2/mint.svg";
import ActiveMintIcon from "../../../assets/images-v2/mint-active.svg";
import UserDetails from "../../custom/UserDetails";
import "./index.scss";

const Header = () => {
  const navigate = useNavigate();

  const gotoHomePage = () => {
    navigate("/discover");
  };

  return (
    <div className="wl-header">
      <div>
        <img
          src={PassageLogoIcon}
          alt="passage logo"
          className="passage-logo cursor-pointer"
          onClick={gotoHomePage}
        />
      </div>
      <div className="header-options">
        <UserDetails />
      </div>
    </div>
  );
};

const SideOptions = () => {
  const [activeOption, setActiveOption] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

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
    navigate("/marketplace");
  };

  const handleExploreClick = () => {
    setActiveOption("marketplace");
    gotoExplore();
  };

  const handleMintClick = () => {
    setActiveOption("mint");
    navigate("/mint");
  };

  // icon color: rgb(155	156	157)
  return (
    <div className="wso-container">
      <Tooltip placement="right" title="Mint">
        {activeOption === "mint" ? (
          <img
            src={ActiveMintIcon}
            alt="mint active"
            style={{ padding: "0 2px", cursor: "pointer" }}
          />
        ) : (
          <img
            src={MintIcon}
            alt="mint"
            onClick={handleMintClick}
            style={{ padding: "0 2px", cursor: "pointer" }}
          />
        )}
      </Tooltip>

      <Tooltip placement="right" title="Marketplace">
        {activeOption === "marketplace" ? (
          <img
            src={ActiveExploreIcon}
            style={{ cursor: "pointer" }}
            alt="marketplace"
          />
        ) : (
          <img
            src={ExploreIcon}
            alt="marketplace"
            onClick={handleExploreClick}
            style={{ cursor: "pointer" }}
          />
        )}
      </Tooltip>
    </div>
  );
};

const WorldLayout = ({ children }) => {
  return (
    <div className="world-layout-container">
      <Header />
      <SideOptions />
      {children}
    </div>
  );
};

export default WorldLayout;
