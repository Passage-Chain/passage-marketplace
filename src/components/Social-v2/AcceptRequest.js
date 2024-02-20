import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import socialService from '../../services/social';
import Toast from '../custom/CustomToast';
import { useDispatch } from 'react-redux';
import { setMaxView, setUpdateFriendList } from '../../redux/friendsSlice';

const AcceptRequest = () => {
  const params = useParams();
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    if (params?.hash) {
      acceptFriendRequest(params?.hash)
    }
  }, [params])

  const acceptFriendRequest = async (hash) => {
    try {
      const response = await socialService.acceptFriendRequest({
        hash,
      });
      const { data } = response
      Toast.success(
        data?.title || "Invitation Accepted!",
        data?.message ||  `You have accepted the invitation.`
      );
      dispatch(setUpdateFriendList(new Date().getTime()))
      dispatch(setMaxView(true))
    } catch (error) {
      console.log(error);
      Toast.error(
        "Unsuccessful",
        "Something went wrong, please try again!",
      );
    }

    history.push('/')
  };

  return null
}

export default AcceptRequest