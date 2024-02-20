import axios from "axios";
import http from "../configs/http";
import { getToken } from "../configs";

const instance = () => {
  return axios.create({
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

const searchUser = (payload) => {
  const { nickname, email } = payload;
  return instance().get(http.searchUser(nickname, email));
};

const sendFriendRequest = (payload) => {
  return instance().post(http.sendFriendRequest, payload);
};

const cancelFriendRequest = (payload) => {
  return instance().patch(http.cancelFriendRequest, payload);
};

const getFriendList = () => {
  return instance().get(http.getFriendList);
};

const removeFriend = (payload) => {
  return instance().patch(http.removeFriend, payload);
};

const getPendingInvites = (pageNo, limit) => {
  return instance().get(http.getPendingInvites(pageNo, limit));
};

const acceptFriendRequest = (payload) => {
  return instance().patch(http.acceptFriendRequest, payload);
};

const rejectFriendRequest = (payload) => {
  return instance().patch(http.rejectionFriendship, payload);
};

const getWorldField = (payload) => {
  return instance().get(http.getWorldField, payload);
};

const getSentInvites = () => {
  return instance().get(http.getSentInvites)
}

export default {
  searchUser,
  sendFriendRequest,
  getFriendList,
  cancelFriendRequest,
  removeFriend,
  getPendingInvites,
  acceptFriendRequest,
  rejectFriendRequest,
  getWorldField,
  getSentInvites
};
