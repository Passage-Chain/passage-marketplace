import React, { useEffect, useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import { ReactSVG } from "react-svg";
import  rightArrow  from "../../assets/images/circle-with-right-arrow.svg";
import  leftArrow  from  "../../assets/images/circle-with-left-arrow.svg";
import "./index.scss";
import userservice from '../../services/userservice'
import { useDispatch, useSelector } from "react-redux";
import { World, RootState } from "_types/types";

interface ISimilarGames {
  to: World
}

const SimilarGames = ({ to }: ISimilarGames ) => {
  const [imageIndex, setImageIndex] = useState(2);
  const [similarWorldData, setSimilarWorldData] = useState([]);
  const account = useSelector((state:RootState) => state.account);
  const history = useHistory();

  const onPrevButton = () => {
    setImageIndex(imageIndex === 2 ? imageIndex : imageIndex-1)
  }

  const onNextButton = () => {
    setImageIndex(imageIndex >= similarWorldData.length-1 ? imageIndex : imageIndex+1)
  }

  useEffect(() => {
    getSimillarWorld();
  }, [to])

  /**
   * Get worlds that are similar to the worldId prop
   * TODO: For now, we're getting all worlds from the backend and filtering out the
   * current world.
   */
  const getSimillarWorld = async () => {
    try {
      let token = account.token;
      const response = await userservice.getSimillarWorld(token);
      setSimilarWorldData(response?.data.filter(w => w._id !== to._id));
    } catch (error) {
      //console.log(error);
    }
  }

  return (
    <>
      <section className="similar_games_container">
        <div className="similar_games_header">
          <h1 className="header_text">SIMILAR GAMES</h1>
          <div>
            <ReactSVG src={leftArrow} className={ (similarWorldData.length < 2 ) ? 'cursor_none':(imageIndex === 2 ? 'cursor_none' : 'cursor_pointer')} onClick={onPrevButton}></ReactSVG>
            <ReactSVG src={rightArrow} className={ (similarWorldData.length < 2 ) ? 'cursor_none':(imageIndex === similarWorldData.length-1 ? 'cursor_none' : 'cursor_pointer')} onClick={onNextButton}></ReactSVG>
          </div>
        </div>

        <div className="carousel">
          <div className="game_container">
            {similarWorldData?.map((slide, idx) => (
              <Link to={`/world/${slide._id}`} key={idx} className={(idx <= imageIndex && idx >= imageIndex - 2) ? 'slide-active' : 'slide'} >
                {(idx <= imageIndex && idx >= imageIndex - 2) && (
              <div className="game_container_child">
                <img src={slide.worldHeaderImage} className="inline-block" alt="No_Image"/>
                <div className="game_title">{slide.worldName}</div>
                <div className="game_tag">
                {slide?.tags?.map((tag,index)=>(
                  <Link to={`/world/${slide._id}`} id={index} key={index} ><small>{tag}</small></Link>))
                }
                </div>
              </div>
              )
              }
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default SimilarGames;
