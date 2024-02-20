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

const getWorlds = () => {
  return instance().get(http.getWorlds());
};

const addToFavorite = (payload) => {
  return instance().post(http.addToFavorite, payload)
}

const getFavorite = () => {
  return instance().get(http.getFavorite())
}

const removeFavorite = (payload) => {
  return instance().patch(http.removeFavorite, payload)
}
const getworldbyid = (id) => {
  return instance().get(http.getworldbyid(id))
}

const getPromotedGames = () => {
  return instance().get(http.getPromotedGames)
}

const getWorldsByFilter = (payload) => {
  return instance().post(http.getWorldsByFilter, payload)
}

const inviteFriendToGame = (payload) => {
  return instance().post(http.inviteFriendToGame, payload)
}

const getFriendListForGameInvitation = (gameId) => {
  return instance().get(http.getFriendListForGameInvitation(gameId))
}

export default {
  getWorlds,
  getworldbyid,
  addToFavorite,
  getFavorite,
  removeFavorite,
  getPromotedGames,
  getWorldsByFilter,
  inviteFriendToGame,
  getFriendListForGameInvitation
};
