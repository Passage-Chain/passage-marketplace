import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ReactComponent as BookmarkedIcon } from '../../assets/images-v2/bookmarked-star.svg'
import worldService from '../../services/world';
import { Tooltip } from 'antd'
import { CustomSelect, CustomSearchInput } from '../custom';

import { ReactComponent as SmallGridIcon } from '../../assets/images-v2/small-grid.svg'
import { ReactComponent as LargeGridIcon } from '../../assets/images-v2/large-grid.svg'
import Toast from '../custom/CustomToast';
import { useHistory } from 'react-router-dom';
import { setUpdateFavouriteList } from '../../redux/favouriteSlice';

const GRID_OPTIONS = {
  DEFAULT: 'default',
  LARGE: 'large'
}

const GameCard = ({ game = {}, handleRemoveToFavourite, gridView, gotoWorld }) => {
  const handleHoverCard = (show = 'block') => {
    const bookmarkEle = document.getElementById(`bookmark-wrapper-${game._id}`)
    if (bookmarkEle) {
      bookmarkEle.style.display = show
    }
  }

  return (
    <div className='f-game-container cursor-pointer' onClick={() => gotoWorld(game?._id)} onMouseOver={() => handleHoverCard('block')} onMouseLeave={() => handleHoverCard('none')}>
      <div className='f-game-img-wrapper'>
        <img
          src={game.worldLogo}
          alt='game'
          className='f-game-image'
        />
        <div id={`bookmark-wrapper-${game._id}`} className='bookmark-wrapper'>
          <Tooltip placement="right" title={'Remove from favorite'}>
            {<BookmarkedIcon onClick={(e) => {
              e.stopPropagation();
              handleRemoveToFavourite(game._id)}
              }
            />}
          </Tooltip>
        </div>
      </div>
      <div className='f-game-detail'>
        <span className='f-game-name'>{game.worldName}</span>
        <div className='f-game-tags-wrapper'>
          {game?.tags?.map((tag, index) => (
            <>{tag && <div key={index} className='f-game-tag'>{tag}</div>}</>
          ))}
        </div>
      </div>
    </div>
  )
}

const SORT_MODE = {
  ASC_BY_TIME: 'ASC_BY_TIME',
  DESC_BY_TIME: 'DESC_BY_TIME',
  ALPHABATIC_ASC: 'ALPHABATIC_ASC',
  ALPHABATIC_DESC: 'ALPHABATIC_DESC'
};

const sortOptions = [
  { id: SORT_MODE.ALPHABATIC_ASC, label: 'A-Z' },
  { id: SORT_MODE.ALPHABATIC_DESC, label: 'Z-A' },
  { id: SORT_MODE.DESC_BY_TIME, label: 'Newest-Oldest' },
  { id: SORT_MODE.ASC_BY_TIME, label: 'Oldest-Newest' },
]

const FavouritePage = () => {
  const [sortOrder, setSortOrder] = useState(SORT_MODE.ALPHABATIC_ASC);
  const [gridView, setGridView] = useState(GRID_OPTIONS.LARGE)
  const [list, setList] = useState([])
  const [filteredList, setFilteredList] = useState([])
  const [searchStr, setSearchStr] = useState('')
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    if (sortOrder === SORT_MODE.ALPHABATIC_ASC) {
      const sorted = [...list].sort((first, second) => {
        return first.worldName.localeCompare(second.worldName);
      })
      setFilteredList(sorted)
    } else if (sortOrder === SORT_MODE.ALPHABATIC_DESC) {
      const sorted = [...list].sort((first, second) => {
        return second.worldName.localeCompare(first.worldName);
      })
      setFilteredList(sorted)
    } else {
      setFilteredList(list)
    }
  }, [sortOrder, list.length])

  useEffect(() => {
    const filtered = [...list].filter(l => l.worldName?.toLowerCase()?.includes(searchStr?.toLowerCase()))
    setFilteredList(filtered)
  }, [searchStr])


  useEffect(() => {
    fetchFavoriteList()
  }, [])

  const gotoWorld = (_id) => {
    history.push(`/world/${_id}`);
  }

  const fetchFavoriteList = async () => {
    try {
      const response = await worldService.getFavorite()
      setList(response.data?.favouriteWorlds.map(f => f.favouriteWorld))
    } catch (error) {
      // handleApiError(error);
    }
  }

  const renderSortOptions = () => {
    return (
      <CustomSelect
        className="border-white"
        options={sortOptions}
        value={sortOrder}
        onChange={value => setSortOrder(value)}
        style={{ width: 170 }}
      />
    )
  }

  const removeFavorite = async (worldId) => {
    try {
      await worldService.removeFavorite({ worldId })
      Toast.success("Removed favourite", 'The world has been removed from favourite successfully!');
      setList(list.filter(l => l._id !== worldId))
      dispatch(setUpdateFavouriteList(new Date().getTime()))
    } catch (error) {
      Toast.error("Unsuccessful", "Something went wrong, please try again!");

    }
  }

  return (
    <div className='favourite-page-container'>
      <div className='fp-header'>
        <div className='fp-header-left'>
          <span className='fp-header-txt'>Favorites</span>
          <div className='fp-header-count'>{list.length}</div>
        </div>
        <div className='fp-header-right'>
          <CustomSearchInput
            placeholder='Search experience'
            value={searchStr}
            onChange={setSearchStr}
          />
          {renderSortOptions()}
          <div className='grid-icon-wrapper' onClick={() => setGridView(GRID_OPTIONS.LARGE)}><LargeGridIcon className='grid-icon' /></div>
          <div className='grid-icon-wrapper' onClick={() => setGridView(GRID_OPTIONS.DEFAULT)}><SmallGridIcon className='grid-icon' /></div>
        </div>
      </div>
      <div className='fp-content'>
          {filteredList.map((game, index) => (
            <div key={index} style={{ width: `${GRID_OPTIONS.DEFAULT === gridView ? 18 : 23}%` }}>
              <GameCard gotoWorld={gotoWorld} game={game} handleRemoveToFavourite={removeFavorite} gridView={gridView}/>
            </div>
          ))}
      </div>
    </div>
  )
}

export default FavouritePage
