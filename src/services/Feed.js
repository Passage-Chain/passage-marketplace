import axios from "axios";
import http from "../configs/http";
import { getToken } from "../configs";


const instancemulti = (token) => {
  return axios.create({
    headers: {
          Authorization: 'Bearer '+ token,
          'content-type': 'multipart/form-data'
      },
  });
};

const instance = () => {
  return axios.create({
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

const editFeed = (token,worldId,feedContent,feedImages,id) => {
  const formData = new FormData()
  formData.append('feedImages', feedImages[0]);
  formData.append('feedImages', feedImages[1]);
  formData.append('feedImages', feedImages[2]);
  formData.append('feedImages', feedImages[3]);
  formData.append('worldId', worldId);
  formData.append('feedContent', feedContent);
  return instancemulti(token).patch(http.editFeed(id), formData).then(res => {
      console.log(res)
  })
};

const createFeed = (token,worldId,feedContent,feedImages) => {
  const formData = new FormData()
  formData.append('feedImages', feedImages[0]);
  formData.append('feedImages', feedImages[1]);
  formData.append('feedImages', feedImages[2]);
  formData.append('feedImages', feedImages[3]);
  formData.append('worldId', worldId);
  formData.append('feedContent', feedContent);
  return instancemulti(token).post(http.createFeed, formData, {
  }).then(res => {
      console.log(res)
  })
};

const getUserFeed = (page, limit) => {
  return instance().get(http.getUserFeed(page, limit));
};
const getMyWorld=(token)=>{
  return instance(token).get(http.getMyWorld);
}
const getMyFeeds= (userId, page, limit) => {
  return instance().get(http.getMyFeeds(userId, page, limit));
};
const getWorldFeed= (token,worldId) => {
  return instance(token).get(http.getWorldFeed(worldId));
};
const likeSocialFeed=(token,feedId)=>{
  return instance(token).get(http.likeSocialFeed(feedId));
}
const deleteSocialFeed=(token,feedId)=>{
  return instance(token).delete(http.deleteSocialFeed(feedId));
}
const allUserBadges= (token,userId) => {
  return instance(token).get(http.allUserBadges(userId));
};
const followUser = (token,payload) => {
  return instance(token).post(http.followUser, payload);
};
const unFollowUser = (token,payload) => {
  console.log("payload :",payload)
  return instance(token).post(http.unFollowUser, payload);
};
const checkForFollowing = (token,targetUserId) => {
  return instance(token).get(http.checkForFollowing(targetUserId));
};
const followCount = (token,targetUserId) => {
  return instance(token).get(http.followCount(targetUserId));
};
export default {
  likeSocialFeed,
  deleteSocialFeed,
  editFeed,
  createFeed,
  getUserFeed,
  getMyWorld,
  getMyFeeds,
  getWorldFeed,
  allUserBadges,
  followUser,
  unFollowUser,
  checkForFollowing,
  followCount,
};
