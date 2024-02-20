import React, { useEffect, useState } from 'react';
import { ReactComponent as BookmarkIcon } from '../../assets/images-v2/bookmark-star.svg'
import { ReactComponent as BookmarkedIcon } from '../../assets/images-v2/bookmarked-star.svg'
import worldService from '../../services/world';
import { Tooltip } from 'antd'
import { setWorldData } from '../../redux/worldSlice';
import './index.scss'
import { useDispatch } from 'react-redux';
import { handleApiError } from '../utils/AuthVerify/AuthVerify';
import { TRACKING_ID } from '../../utils/globalConstant';
import { googleAnalyticsActions } from '../../utils/googleAnalyticsInit';
import { setUpdateFavouriteList } from '../../redux/favouriteSlice';
import { setSelectedWorld } from '../../redux/worldSlice';
import Toast from '../custom/CustomToast';
import { useHistory } from 'react-router-dom';

const SuggestCard = ({ game = {}, handleAddToFavourite, isFavourite, gotoWorld }) => {
  const handleHoverCard = (show = 'block') => {
    const bookmarkEle = document.getElementById(`bookmark-wrapper-${game._id}`)
    if (bookmarkEle) {
      bookmarkEle.style.display = show
    }
  }

  return (
    <div className='suggested-game-card cursor-pointer' onClick={() => gotoWorld(game?._id)} onMouseOver={() => handleHoverCard('block')} onMouseLeave={() => handleHoverCard('none')}>
      <img className='sgc-thumbnail-img' src={game.worldLogo} alt='game' />
      <div id={`bookmark-wrapper-${game._id}`} className='bookmark-wrapper'>
        <Tooltip placement="right" title={isFavourite ? 'Added to favorite' : 'Add to favorite'}>
          {isFavourite ? <BookmarkedIcon /> : <BookmarkIcon onClick={(e) => { 
            e.stopPropagation();
            handleAddToFavourite(game._id)}
          } 
        />}
        </Tooltip>
      </div>
      <div className='sgc-details'>
          <span className='sgc-name'>
            {game.worldName}
          </span>
          <div className='sgc-tags'>
            {game.tags.map((tag, index) => (
              <>{tag && <div key={index} className='sgc-tag'>{tag}</div>}</>
            ))}
          </div>
        </div>
    </div>
  )
}

const SuggestedGames = ({ }) => {
  const [suggestedGames, setSuggestedGames] = useState([])
  const [viewableList, setViewableList] = useState([])
  const [nextDisabled, setNextDisabled] = useState(true)
  const [previousDisabled, setPreviousDisabled] = useState(true)
  const [favouriteList, setFavouriteList] = useState([])
  const dispatch = useDispatch();
  const history = useHistory()

  useEffect(() => {
    fetchSuggestedGames()
  }, [])

  const handleNextClick = () => {
    setViewableList((suggestedGames || []).slice(-3))
    setNextDisabled(true)
    setPreviousDisabled(false)
  }

  const handlePreviousClick = () => {
    setViewableList((suggestedGames || []).slice(0, 3))
    setNextDisabled(false)
    setPreviousDisabled(true)
  }

  const gotoWorld = (_id) => {
    sessionStorage.setItem("worldid", _id);
    dispatch(setSelectedWorld(_id))
    history.push('/world');
  }

  const fetchSuggestedGames = async () => {
    try {
      const response = await worldService.getWorlds()
      setSuggestedGames((response.data || []).slice(0, 5))
      setViewableList((response.data || []).slice(0, 3))
      dispatch(setWorldData(response.data));
      if (response.data?.length > 3) {
        setNextDisabled(false)
      }

      const favouriteList = response.data?.filter(d => d.isFavourite).map(d => d._id)
      setFavouriteList(favouriteList)
    } catch (error) {
      handleApiError(error);
    }
  }

  const addToFavorite = async (worldId) => {
    try {
      const response = await worldService.addToFavorite({ worldId })
      Toast.success("Added to favourite", 'The world has been added to favourite successfully!');
      googleAnalyticsActions.initGoogleAnalytics(TRACKING_ID,  'Added world', 'World');
      setFavouriteList([ ...favouriteList, worldId ])
      dispatch(setUpdateFavouriteList(new Date().getTime()))
    } catch (error) {
      console.log(error)
      Toast.error("Unsuccessful", "Something went wrong, please try again!");
    }
  }

  return (
    <div className='suggested-games-container'>
      <div className='sg-header'>
        <span className='sg-header-txt'>SUGGESTED GAMES</span>
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

      <div className='sg-list'>
        {viewableList.map((game, index) => (
          <div 
            key={index} 
            style={{ 
              flex: '30%', 
              maxWidth: '32%', 
              alignItems: 'stretch', 
              display: 'flex' 
              }}
            >
            <SuggestCard 
              key={index} 
              game={game} 
              handleAddToFavourite={addToFavorite} 
              isFavourite={favouriteList.includes(game._id)}
              gotoWorld={gotoWorld}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SuggestedGames