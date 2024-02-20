import { useEffect, useState } from "react";
import { Modal } from "antd";
import { useHistory } from "react-router-dom";
import { Link, Redirect } from "react-router-dom";
import "../../styles/style.css";

import "./index.scss";
import { ReactComponent as PlayIcon } from "../../assets/images-v2/play.svg";
import StrangeClanLogo from "../../assets/images-v2/strange-clan-logo.png";
import { ReactComponent as RightArrowIcon } from "../../assets/images/chevron_right_arrow.svg";
import { ReactComponent as RightArrowPointer } from "../../assets/images/arrow_left.svg";
import LogInForm from "./LoginForm";
import { useSelector } from "react-redux";

import worldService from "../../services/world";

const worldData = {
  gameImage: "../../assets/images-v2/strange-clan-game-bg.jpg",
  name: "Strange Clan",
  logo: StrangeClanLogo,
  description: `Strange Clan™ is an online, action RPG, using Play-2-Own mechanics to give players ownership of their digital items in game.`,
  additionDescription: `Strange Clan is built with Unreal Engine 5 and Passage which means beautiful graphics, accessible on any device. Passage also enables in-game NFT creation, so players can craft and trade their in-game items and customizations.`,
  tags: ["RPG", "Online", "Adventure", "Quests", "Open World"],
};

export default function LogIn() {
  const [open, setOpen] = useState(false);
  const token = useSelector((state) => state.account.token);
  const [worldList, setWorldList] = useState([]);
  const [redirectToDiscover, setRedirectToDiscover] = useState(false);

  const history = useHistory();

  useEffect(() => {
    fetchPromotedWorlds();
  }, []);

  const fetchPromotedWorlds = async () => {
    try {
      const response = await worldService.getWorldsByFilter({
        genres: "",
        themes: "",
      });
      const worldList = [...response.data].slice(0, 6).sort((first, second) => {
        return first.worldName.localeCompare(second.worldName);
      });
      setWorldList(worldList);
    } catch (error) {
      console.log(error);
    }
  };

  if (token) {
    return <Redirect to="/discover" />;
  }

  const showModal = () => {
    setOpen(true);
  };
  const hideModal = () => {
    setOpen(false);
  };

  const handleDiscoverMoreClick = () => {
    setOpen(true);
    setRedirectToDiscover(true);
  };

  const handleRedirection = () => {
    if (redirectToDiscover) {
      setRedirectToDiscover(false);
      history.push("/discover");
    }
  };

  return (
    <>
      <div className="world-container">
        <div className="world-detail-container home-container">
          <div style={{ display: "flex" }}>
            <span>
              <Link to="/marketplace">
                <button className="marketplace-button">
                  <span className="marketplace-text">
                    Go to Marketplace{" "}
                    <RightArrowPointer
                      style={{
                        transform: "rotate(180deg)",
                        padding: "0 10px 0 0",
                      }}
                    />
                  </span>
                </button>
              </Link>
            </span>
            <div className="world-cta-wrapper new_logIn_button_container">
              <span className="logIn_button" onClick={showModal}>
                <span>LOG IN</span>
              </span>
              <Link to="/registration">
                <button className="auth-button new-logIn-button">
                  <span>SIGN UP</span>
                </button>
              </Link>
            </div>
          </div>
          <div className="asset_content">
            <div className="overlay-content-wrapper position_top">
              <button className="auth-button max_width_220">
                <span>Promoted Experience</span>
              </button>
              <img
                className="clan-logo"
                src={worldData.logo}
                alt={worldData.name}
              />
              <span className="description-txt">{worldData.description}</span>
              <div className="world-cta-wrapper">
                <button className="play-btn" onClick={showModal}>
                  <PlayIcon />
                  <span className="play_label_button">PLAY</span>
                </button>
                <button className="bookmark-btn">
                  {/* <BookmarkIcon /> */}
                  <span className="btn-label" style={{ color: "#000" }}>
                    FREE
                  </span>
                </button>
              </div>
              <Modal
                className="login_modal"
                visible={open}
                onOk={hideModal}
                onCancel={hideModal}
              >
                <LogInForm handleRedirection={handleRedirection} />
              </Modal>
            </div>
            <div className="experience_highlight">
              <span className="heading_exp_high">
                <span>Highlighted Experiences</span>
              </span>
              {worldList.map((world, index) => (
                <div key={index} className="mapped_container">
                  <div className="highlighted_image_logo">
                    <img src={world.worldLogo} alt="noImage" />
                  </div>
                  <div className="right_section_data">
                    {world.additionalTag && (
                      <div className="world-tag-wrapper">
                        <span className="world-tag">{world.additionalTag}</span>
                      </div>
                    )}
                    <span className="world-name">{world.worldName}</span>
                  </div>
                </div>
              ))}
              <div className="discover-more-btn-wrapper">
                <button
                  className="discover-more-btn"
                  onClick={handleDiscoverMoreClick}
                >
                  <span>
                    DISCOVER MORE <RightArrowIcon />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
