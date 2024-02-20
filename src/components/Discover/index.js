import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CarouselPaginationView } from '../custom';

import { ReactComponent as BookmarkIcon } from '../../assets/images-v2/bookmark-star.svg'
import { ReactComponent as StarOutlineIcon } from '../../assets/images/staroutlined.svg'

import { useDispatch, useSelector } from "react-redux";
import { TRACKING_ID } from '../../utils/globalConstant';
import { googleAnalyticsActions } from '../../utils/googleAnalyticsInit';
import { setUpdateFavouriteList } from '../../redux/favouriteSlice'
import Toast from '../custom/CustomToast'

import './index.scss'
import worldService from '../../services/world';
import { handleApiError } from '../utils/AuthVerify/AuthVerify';
import userservice from 'src/services/userservice';
import { categoryForWorldName } from 'src/utils/viewHelpers';
import Schedule from '../World/Schedule';

const mainTags = [
  'TRENDING', 'SUGGESTED GAMES', 'NEWEST EXPERIENCES', 'UPCOMING EVENTS',
]

const Discover = ({  }) => {
  const [nextDisabled, setNextDisabled] = useState(true)
  const [previousDisabled, setPreviousDisabled] = useState(true)
  const [worlds, setWorlds] = useState([])
  const [favouriteList, setFavouriteList] = useState([])
  const [activeWorldIndex, setActiveWorldIndex] = useState(-1)
  const account = useSelector((state) => state.account);
  const history = useHistory()
  const dispatch = useDispatch();

  useEffect(() => {
    fetchTrendingGames()
  }, [])

  const fetchTrendingGames = async () => {
    try {
      const response = await worldService.getWorlds()
      const worlds = response.data
      setWorlds(worlds)
      if (worlds?.length > 0) {
        setActiveWorldIndex(0)
      }

      if (worlds?.length > 0) {
        setNextDisabled(false)
      }

      const favouriteList = worlds?.filter(d => d.isFavourite).map(d => d._id)
      setFavouriteList(favouriteList)
    } catch (error) {
      handleApiError(error);
    }
  }

  // const toggleSider = () => {
  //   setShowFilterSider(!showFilterSider)
  // }

  // const updateFilterString = async (newFilter) => {
  //   setFilters(newFilter);
  // };

  const gotoWorldPage = (world) => {
    history.push(`/world/${world._id}`)
  }

  const toggleFavorite = async(world, makeFavorite=true) => {
    try {
      let response;

      if (makeFavorite) {
        response = await userservice.makeworldFavourite({ worldId: world._id }, account.token);
      } else {
        response = await userservice.removeWorldFromFav({ worldId: world._id }, account.token);
      }

      dispatch(setUpdateFavouriteList(new Date().getTime()))
      Toast.success(`${world.worldName} has been ${makeFavorite ? 'added to' : 'removed from'} your favorites.`);
      googleAnalyticsActions.initGoogleAnalytics(TRACKING_ID, 'Added', 'Successful');

      const _worlds = [...worlds];
      _worlds[activeWorldIndex].isFavourite = makeFavorite;
      setWorlds(_worlds);
    } catch (err) {
      if (err.response.status === 500) {
        Toast.error("Unsuccessful", "You have already made this world a favorite.");
      } else {
        Toast.error("Unsuccessful", "Something went wrong, please try again!");
      }
    }
  }

  useEffect(() => {
    setNextDisabled(activeWorldIndex === worlds.length - 1)
    setPreviousDisabled(activeWorldIndex === 0)
  }, [activeWorldIndex])

  const handleNextClick = () => {
    setActiveWorldIndex(activeWorldIndex + 1)
  }

  const handlePreviousClick = () => {
    setActiveWorldIndex(activeWorldIndex - 1)
  }

  return (
    <div className='discover-container'>
      <div className='d-header'>
        <span className='d-header-label'>Discover</span>
        {/* <CustomSearchInput placeholder='Search experience'/> */}
      </div>
      <div className='d-subheader'>
        {/*<ExpandFilterIcon className='expand-icon' onClick={toggleSider} />*/}

        <div className='d-main-tags-wrapper'>
          {/*mainTags.map((tag, index) => (
            <div key={index} className='d-main-tag'>
              <span>{tag}</span>
            </div>
          ))*/}
        </div>
      </div>

      <div className='d-content-wrapper'>
        <div className='d-right-content-wrapper'>
          {worlds.length > 0 ? <div className='d-treding-container'>
            <div className='d-t-header'>
              <span>TRENDING</span>
              <div className='sg-header-nav-cta'>
                <div
                  className={`previewBtn ${previousDisabled ? 'disabledBtn' : ''}`}
                  onClick={handlePreviousClick}
                >
                </div>
                <div
                  className={`nextBtn ${nextDisabled ? 'disabledBtn' : ''}`}
                  onClick={handleNextClick}
                >
                </div>
              </div>
            </div>
            <div className='d-t-content'>
              <div className='d-t-image-wrapper'>
                <img className='trending-image' src={worlds[activeWorldIndex]?.worldPromoImage} alt='game' />
              </div>
              <div className='d-t-details'>
                <div className='d-t-details-top'>
                  <span className='d-t-details-txt1'>{ categoryForWorldName(worlds[activeWorldIndex]?.worldName) }</span>
                  <span className='d-t-details-txt2'><b>{worlds[activeWorldIndex]?.worldName}</b></span>
                  <span className='d-t-details-txt3'>
                    {worlds[activeWorldIndex]?.shortDescription}
                  </span>
                </div>

                <div className='d-t-details-bottom'>
                  <div className='d-t-details-tags-wrapper'>
                    {/*['Adventure', 'Action', 'RPG', 'MMO'].map((tag, index) => (
                      <div key={index} className='d-t-details-tag'>
                        <span>{tag}</span>
                      </div>
                    ))*/}
                  </div>
                  <div className='d-t-cta'>
                    <div className='d-t-see-more-btn' onClick={() => gotoWorldPage(worlds[activeWorldIndex])}>SEE MORE</div>
                    <div className='d-t-add-favorite'>
                      {
                        !worlds[activeWorldIndex]?.isFavourite ?
                          <StarOutlineIcon
                            className='favorite-icon'
                            onClick={() =>
                              toggleFavorite(worlds[activeWorldIndex], !worlds[activeWorldIndex].isFavourite)
                            }
                          /> :
                          <BookmarkIcon
                            className='favorite-icon'
                            onClick={() =>
                              toggleFavorite(worlds[activeWorldIndex], !worlds[activeWorldIndex].isFavourite)
                            }
                          />
                      }
                    </div>
                    { worlds[activeWorldIndex]?.tours?.length && <Schedule /> }
                  </div>
                </div>
              </div>
            </div>
            <CarouselPaginationView length={worlds.length} activeIndex={activeWorldIndex} onClick={setActiveWorldIndex} />
          </div> : <div className='no-world-txt'>Coming Soon...</div>}

        </div>
      </div>
    </div>
  )
}

export default Discover
