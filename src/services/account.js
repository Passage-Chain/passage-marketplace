import axios from "axios";
import http from "../configs/http";
import { getToken } from "../configs";
import { backoff } from '../utils/backoff';

const instance = () => {
  return axios.create({
    headers: {
      Authorization: 'Bearer ' + getToken(),
    },
  });
};

function login(login, password, keepLoggedInFlag) {
  return axios.post(http.login, {
    identifier: login,
    password: password,
    keepLoggedInFlag: keepLoggedInFlag
  }, {withCredentials: true});
}

function register(userDetails) {
  const payload = {
    email: userDetails.logInUser,
    nickname: userDetails.publicUserName,
    ticket: userDetails.accessCode,
    password: userDetails.password,
    isConditionsAgreed: userDetails.isConditionsAgreed,
    receiveNews: userDetails.receiveNews
  };
  return instance().post(http.register, payload, {withCredentials: true});
};

function getWebsocketToken(){
  return instance().get(http.getWebsocketToken);
}
function uniqueUserName(userName) {
  return axios.post(http.uniqueUserName, {
    userName
  });
}
function uniqueEmail(email) {
  return axios.post(http.uniqueEmail, {
    email
  });
}

function facebookAuth(token) {
  return axios.post(http.facebookAuth, {
    accessToken: token,
  });
}

function whoami() {
  return instance().get(http.whoami);
}

function getAgoraToken(token, channelName, uid) {
  return axios.get(http.getAgoraTokenUrl(channelName, uid), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function getFriendsList(token) {
  return instance().get(http.friendsList);
}

function getNeonItems(token) {
  return axios.get(http.getNeonListItems(0, 999), {
    headers: {
      Authorization: token,
    },
  });
}

function deleteFriend(token, friendId) {
  return axios.patch(
    http.deleteFriend(friendId),
    {},
    {
      headers: {
        Authorization: token,
      },
    }
  );
}
function requestFriendship(token, userId) {
  return axios.patch(
    http.requestFriendship,
    {
      userId: userId,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
}
function rejectionfriendship(token, userId) {
  return axios.patch(
    http.rejectionFriendship,
    {
      userId: userId,
    },
    {}
  );
}
function addFriend(token, userId) {
  return axios.patch(
    http.addFriend,
    {
      userid: userId,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
}
function searchUser(token, email, userName) {
  return axios.get(http.searchUser(userName), {
    headers: {
      Authorization: token,
    },
    email: email,
    userName: userName,
    skip: 0,
    limit: 999999999,
  });
}

function updateUser(token, data) {
  return axios.patch(http.updateUser, data, {
    headers: {
      Authorization: token,
    },
  });
}

function updatePrivacy(
  token,
  searchUserName,
  searchFacebook,
  myVideo,
  myAudio
) {
  return axios.patch(
    http.updatePrivacy,
    {
      searchUserName: searchUserName,
      searchFacebook: searchFacebook,
      myVideo: myVideo,
      myAudio: myAudio,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
}
function addReport(payload) {
  return instance().post(
    http.addReport, payload,
  );
}

function getGiveMyServer() {
  return axios.get(http.getGiveMeServer);
}

/**
 * Attempt to reserve a game instance for <gameName>. This will try for one
 * hour, then quit with an exception.
 * @param token the browser's session token obtained at login; see the getToken
 * function in configs/index.js
 * @param gameName the gameName is usually the name of the Unreal .uproject
 * file, without the .uproject extension. This must match the Backend's game
 * instance name and the name field in the backend's World model.
 */
function getGameInstanceUrl(token, gameName) {
    return backoff(3600, async () => {
        let response = await axios.get(
            `${http.getGameInstanceUrl}?gameName=${gameName}`, {
            headers: {
                "Authorization": 'Bearer ' + token,
            }});
        if (response.data?.url != null) {
            return response.data;
        } else {
            // this signals to the backoff function that we did not succeed
            throw new Error(`Still waiting for ${gameName} game instance...`);
        }
    });
}

async function getGameSessionToken(token) {
    let response = await axios.get(http.getGameSessionToken, {
        headers: {
            "Authorization": 'Bearer ' + token,
        }});
    if (response.data.gameToken != null) {
        return response.data.gameToken;
    }
}

function getEventDetails(eventName) {
  return axios.get(http.getEventDetails(eventName));
}

function getUserSettingNotification() {
  return instance().get(http.getUserSettingNotification);
}
function updateUserSettingNotification(notificationSettings) {
  const payload = {
    notificationSettings: notificationSettings
  }
  return instance().patch(http.updateUserSettingNotification, payload);
}
function getUserDetails(token) {
  return axios.get(http.getUserDetails, {
    headers: {
      cookies: token,
    },
  });
}
function updateUserDetails(newEmail, password, newPassword) {
  const payload = {
    newEmail,
    password,
    newPassword
  }
  return instance().patch(http.updateUserDetails, payload);
}
function connectWallet() {
  return instance().get(http.connectWallet);
  // return axios.get(http.connectWallet, {
  //   headers: {
  //     cookies: token,
  //   },
  // });
}
function getWalletList() {
  return instance().get(http.getWalletList);
}
function getUserPublicProfile(token) {
  return instance().get(http.getUserPublicProfile);
}
function updateUserPublicProfile(profileData) {
  const formData = new FormData()
  formData.append('updateImageFlag', profileData.updateImageFlag);
  formData.append('profileName', profileData.profileName);
  formData.append('nickname', profileData.nickname);
  formData.append('briefInfo', profileData.briefInfo);
  formData.append('deleteImageFlag', profileData.deleteImageFlag);
  formData.append('profileImage', profileData.profileImage);

  return instance().patch(http.updateUserPublicProfile, formData);
}
function getUserAudioVideoInfo() {
  return instance().get(http.userAudioVideoInfo);
}
function updateUserAudioVideoInfo( data) {
  return instance().patch(http.updateUserAudioVideoInfo, {audioVideoInfo: data});
}

function getRefreshToken( data) {
  return instance().post(http.getRefreshToken, {}, {withCredentials: true});
}

function sendPasswordRecovryEmail(token, identifier) {
  return axios.post(
    http.sendPasswordRecovryEmail,
    {
      identifier,
    },
    {
      headers: {
        cookies: token,
      },
    }
  );
}

function validateSecurityCode(email, securityHash) {
  return axios.post(
    http.validateSecurityCode,
    {
      email,
      securityCode: securityHash,
    }
  );
}

function resetPassword( securityHash, email, newPassword) {
  return axios.patch(
    http.resetPassword,
    {
      securityCode: securityHash,
      email,
      newPassword
    }
  );
}

function getNotifications() {
  return instance().get(http.getNotifications);
}
function markAsReadByNotifId( notificationId) {
  return instance().patch(http.markAsReadByNotifId(notificationId));
}
function markAllAsRead() {
  return instance().put(http.markAllAsRead);
}
function getAllWalletList(){
  return instance().get(http.getAllWalletList);
}
function makeWalletActive( walletAddress) {
  const payload = {walletAddress: walletAddress};
  return instance().patch(http.makeWalletActive, payload);
}
function addWallet( walletAddress, walletType) {
  const payload = {walletAddress: walletAddress, walletType: walletType};
  return instance().post(http.addWallet, payload);
}
function deleteWallet( walletAddress) {
  const payload = {walletAddress: walletAddress};
  return instance().delete(http.deleteWallet, {data: payload});
}
function getGlobalSearch(keyword, category){
  return instance().get(http.getGlobalSearch(keyword, category));
}
export default {
  login,
  register,
  facebookAuth,
  getAgoraToken,
  whoami,
  getFriendsList,
  deleteFriend,
  requestFriendship,
  rejectionfriendship,
  addFriend,
  searchUser,
  updateUser,
  getGiveMyServer,
  getGameInstanceUrl,
  getGameSessionToken,
  updatePrivacy,
  addReport,
  getNeonItems,
  getEventDetails,
  getUserSettingNotification,
  updateUserSettingNotification,
  getUserDetails,
  updateUserDetails,
  getUserPublicProfile,
  updateUserPublicProfile,
  connectWallet,
  getUserAudioVideoInfo,
  updateUserAudioVideoInfo,
  uniqueUserName,
  uniqueEmail,
  sendPasswordRecovryEmail,
  validateSecurityCode,
  resetPassword,
  getWalletList,
  getRefreshToken,
  getNotifications,
  markAsReadByNotifId,
  markAllAsRead,
  getAllWalletList,
  makeWalletActive,
  addWallet,
  deleteWallet,
  getGlobalSearch,
  getWebsocketToken
};
