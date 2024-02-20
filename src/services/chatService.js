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

const createGroup = (payload) => {
  return instance().post(http.createGroup, payload);
};

const renameGroup = (payload) => {
  return instance().post(http.renameGroup, payload)
}

const addMemberToGroup = (payload) => {
  return instance().post(http.addMemberToGroup, payload)
}

const removeMemberFromGroup = (payload) => {
  return instance().post(http.removeMemberFromGroup, payload)
}

const muteGroup = (payload) => {
  return instance().post(http.muteGroup, payload)
}

const unMuteGroup = (payload) => {
  return instance().post(http.unMuteGroup, payload)
}

const leaveGroup = (payload) => {
  return instance().post(http.leaveGroup, payload)
}

const searchUser = (payload) => {
  const { userName, email } = payload;
  return instance().get(http.searchUser(userName, email));
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

const removeFriend = (userId) => {
  return instance().patch(http.removeFriend(userId));
};

const getChatSecretKey = () => {
  return instance().get(http.getChatSecretKey)
}

const notifiyChatMessage = (payload) => {
  return instance().post(http.createdNotification, payload)
}

export default {
  searchUser,
  sendFriendRequest,
  getFriendList,
  cancelFriendRequest,
  removeFriend,
  createGroup,
  renameGroup,
  addMemberToGroup,
  muteGroup,
  unMuteGroup,
  leaveGroup,
  getChatSecretKey,
  removeMemberFromGroup,
  notifiyChatMessage
};