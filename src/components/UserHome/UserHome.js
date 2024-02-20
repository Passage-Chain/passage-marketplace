import React, { useState, useRef } from "react";
import { ReactComponent as Slidearrow } from "../../assets/images/expandbutton.svg";
import { ReactComponent as PlayIcon } from "../../assets/images-v2/play.svg";
import { ReactComponent as BookmarkIcon } from "../../assets/images-v2/bookmark-star.svg";
import staroutlined from "../../assets/images/staroutlined.svg";
import WorldLayout from "../layout/World/index";
import userservice from "../../services/userservice";
import { useDispatch, useSelector } from "react-redux";
import Notify from "../utils/Notification/notify";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { handleApiError } from "../utils/AuthVerify/AuthVerify";
import { TRACKING_ID } from "../../utils/globalConstant";
import { googleAnalyticsActions } from "../../utils/googleAnalyticsInit";
import "./newuser.scss";

const UserHome = ({ labeltoshow }) => {
  const account = useSelector((state) => state.account);
  const [worldDataList, setworldData] = useState({});
  const [bgImage, setbgImage] = useState("");
  const [makefavflag, setmakefavflag] = useState(false);
  const [favflag, setfavWorld] = useState(false);
  const history = useHistory();

  const divRef = useRef();
  useEffect(() => {
    getFavouriteworld();
    if (labeltoshow == "Promoted") getPromotedGames();
    else getMostPlayedGame();
  }, []);
  useEffect(() => {
    getFavouriteworld();
  }, [bgImage]);

  const getMostPlayedGame = async () => {
    try {
      const response = await userservice.getMostPlayedGame(account.token);
      let mostplayedgames = response?.data;
      setworldData(response?.data);
      setbgImage(response?.data?.worldHeaderImage);
    } catch (error) {
      handleApiError(error);
    }
  };
  const getFavouriteworld = async () => {
    try {
      const response = await userservice.getFavouriteworld(account.token);
      let favworlds = response?.data?.favouriteWorlds;
      if (favworlds.filter((e) => e._id === worldDataList?._id).length > 0)
        setfavWorld(true);
      else setfavWorld(false);
    } catch (error) {
      console.log(error);
      setfavWorld({});
      //handleApiError(error);
    }
  };
  const getPromotedGames = async () => {
    try {
      const response = await userservice.getPromotedGames(account.token);
      setworldData(response?.data);
      setbgImage(response?.data?.worldHeaderImage);
    } catch (error) {
      console.log(error);
      setworldData({});
    }
  };
  const removeWorldFromFav = async (worldid) => {
    try {
      const payload = {
        worldId: worldid,
      };
      let token = account.token;
      const response = await userservice.removeWorldFromFav(payload, token);
      Notify.success({
        title: "World has been removed from your Favourites",
        body: "World has been removed from your Favourites List",
        action: "invite_success",
      });
      //updateList && updateList();
      setmakefavflag(false);
      setfavWorld(false);
    } catch (error) {
      console.log(error);
      Notify.error({
        title: "Unsuccessful",
        body: "Error : Please try after sometime",
      });
    }
  };
  const addworldtofav = async (worldid) => {
    try {
      const payload = {
        worldId: worldid,
      };
      let token = account.token;
      const response = await userservice.makeworldFavourite(payload, token);
      setmakefavflag(true);
      setfavWorld(true);
      Notify.success({
        title: "World has been added to Favourites",
        body: "World has been added to your Favourites List",
        action: "invite_success",
      });
      //updateList && updateList();

      googleAnalyticsActions.initGoogleAnalytics(
        TRACKING_ID,
        "Added Favourite",
        "Favourite"
      );
    } catch (error) {
      console.log(error);
      if (error.response.status == 500) {
        Notify.error({
          title: "Unsuccessful",
          body: "You have already made this world as favourite ",
        });
      } else {
        Notify.error({
          title: "Unsuccessful",
          body: "Error : Please try after sometime",
        });
      }
    }
  };
  return (
    <div className="world-container">
      <div
        className="world-detail-container home-container"
        style={{
          backgroundImage: `url(${bgImage})+no-repeat center center scroll`,
        }}
      >
        {console.log("bg", bgImage)}
        <div className="overlay-content-wrapper">
          {labeltoshow == "Promoted" ? (
            <div className="pramotedlabeldiv">
              <label className="pramotedlabel">Promoted Experience</label>
            </div>
          ) : (
            <div className="mostplayeddiv">
              <label className="mostplayed">Most Played</label>
            </div>
          )}
          <img
            className="clan-logo"
            src={worldDataList.worldLogo}
            alt={worldDataList.worldName}
          />
          <span className="description-txt">
            {worldDataList.longDescription}
          </span>
          <div className="world-cta-wrapper">
            <button className="play-btn">
              <PlayIcon />
              <span>PLAY</span>
            </button>
            <button className="bookmark-btn">
              {favflag == true || makefavflag == true ? (
                <BookmarkIcon
                  className="favicon"
                  onClick={() => removeWorldFromFav(worldDataList._id)}
                />
              ) : (
                <div>
                  <img
                    className="favicon"
                    src={staroutlined}
                    alt={worldDataList.worldName}
                    onClick={() => addworldtofav(worldDataList._id)}
                  />
                  <span
                    className="btn-label"
                    onClick={() => addworldtofav(worldDataList._id)}
                  >
                    ADD TO FAVORITE
                  </span>
                </div>
              )}
            </button>
          </div>
        </div>
        <div className="slidebuttondiv">
          <span className="slidebutton">
            <Slidearrow
              className="expandbutton"
              onClick={() => {
                divRef.current.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </span>
        </div>
      </div>
      <div className="socialcontent" ref={divRef}></div>
    </div>
  );
};

export default UserHome;
