import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socialService from '../../services/social';
import worldService from '../../services/world';

import AddFriendModal from "../Social/AddFriendModal"

import MaximizedFriendList from './MaximizedFriendList';
import MinimizedFriendList from './MinimizedFriendList';
import "./index.scss"
import { setMaxView } from '../../redux/friendsSlice';

const VIEW_MODE = {
  MIN: "MIN",
  MAX: "MAX"
}

const Social = () => {
  const [viewMode, setViewMode] = useState(VIEW_MODE.MIN)
  const [openAddFriendModal, setOpenAddFriendModal] = useState(false);
  const [friendList, setFriendList] = useState([]);
  const [pendingList, setPendingList] = useState([]);
  const [sentList, setSentList] = useState([]);
  const [sentGameInviteList, setGameInviteList] = useState([]);
  const onlineUsers = useSelector(state => state.chat.onlineUsers)
  const updateFriendList = useSelector(state => state.friends.updateFriendList)
  const maxView = useSelector(state => state.friends.maxView)
  const dispatch = useDispatch()
  const { selectedWorld } = useSelector(state => state.world)

  useEffect(() => {
    if (maxView) {
      setViewMode(VIEW_MODE.MAX)
    }
  }, [maxView])

  useEffect(() => {
    fetchPendingInvites();
    fetchSentInvites();
  }, []);

  useEffect(() => {
    fetchGameInvites();
  }, [selectedWorld])

  const fetchGameInvites = async() => {
    try {
      const response = await worldService.getFriendListForGameInvitation(selectedWorld)
      const list = response?.data?.friendsList || []
      setGameInviteList(list.filter(friend => friend?.isInvited))
    } catch (error) {
      console.log(error)
      setGameInviteList([])
    }
  }

  useEffect(() => {
    fetchFriends()
  }, [updateFriendList])

  const fetchFriends = async () => {
    try {
      const response = await socialService.getFriendList();
      const list = response?.data?.result || [];
      setFriendList(list);
    } catch (error) {
      setFriendList([]);
    }
  };

  const fetchPendingInvites = async () => {
    try {
      const response = await socialService.getPendingInvites();
      const list = response?.data?.userData || [];
      setPendingList(list);
    } catch (error) {
      setPendingList([]);

    }
  };

  const fetchSentInvites = async () => {
    try {
      const response = await socialService.getSentInvites();
      const list = response?.data?.userData || [];
      setSentList(list);
    } catch (error) {
      setSentList([]);
    }
  };

  return (
    <>
      {
        viewMode === VIEW_MODE.MIN ?
          <MinimizedFriendList
            handleMaximize={() => {
              setViewMode(VIEW_MODE.MAX);
            }
            }
            friendList={friendList}
            onlineUsers={onlineUsers}

          /> :
          <MaximizedFriendList
            handleMinimize={() => {
              dispatch(setMaxView(false))
              setViewMode(VIEW_MODE.MIN)
            }}
            handleMaximize={() => setViewMode(VIEW_MODE.MAX)}
            friendList={friendList}
            handleAddClick={() => setOpenAddFriendModal(true)}
            pendingList={pendingList}
            fetchFriends={fetchFriends}
            fetchPendingInvites={fetchPendingInvites}
            onlineUsers={onlineUsers}
            sentList={sentList}
            fetchSentInvites={fetchSentInvites}
            sentGameInviteList={sentGameInviteList}
            fetchGameInvites={fetchGameInvites}
          />
      }
      {openAddFriendModal && (
        <AddFriendModal
          friendList={friendList}
          handleClose={() => setOpenAddFriendModal(false)}
        />
      )}
    </>
  )
}

export default Social
