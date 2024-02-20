import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd'
import { useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';

import worldService from '../../services/world';

import { ReactComponent as FavouriteIcon } from '../../assets/images-v2/star-grey.svg'
import { ReactComponent as ExpandIcon } from '../../assets/images-v2/expand-goto.svg'
import './index.scss'

const MinimizedFavouriteContainer = () => {
  const [list, setList] = useState([])
  const history = useHistory()

  const { updateFavouriteList } = useSelector((state) => state.favourite)

  const gotoWorld = (_id) => {
    //sessionStorage.setItem("worldid", _id);
    //dispatch(setSelectedWorld(_id))
    history.push(`/world/${_id}`);
  }

  const gotoFavourites = (e) => {
    e.stopPropagation()
    history.push('/favourites')
  }

  useEffect(() => {
    fetchFavoriteList()
  }, [updateFavouriteList])

  const fetchFavoriteList = async () => {
    try {
      const response = await worldService.getFavorite()
      setList((response.data?.favouriteWorlds.map(f => f.favouriteWorld) || []).slice(0, 3))
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='mini-fav-container'>
      <div className='minf-left'>
        <FavouriteIcon className='fav-icon' />
      </div>
      <div className='minf-middle'>
        {list.map((world, index) => (
          <Tooltip key={index} placement="bottom" title={world.worldName}>
            <img className='world-icon' src={world.worldIcon} alt={world.worldName} onClick={()=>gotoWorld(world._id)} />
          </Tooltip>

        )) }
      </div>
      <div className='minf-right'>
        <ExpandIcon className='expand-icon' onClick={gotoFavourites} />
      </div>
    </div>
  )
}

export default MinimizedFavouriteContainer
