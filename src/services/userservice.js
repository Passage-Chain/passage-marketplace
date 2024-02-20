
import axios from "axios";
import http from "../configs/http";
import { getToken } from "../configs";

const instance = (token) => {
    return axios.create({
      headers: {
            Authorization: 'Bearer '+ token,
        },
    });
  };

const makeworldFavourite = (payload,token) => {
    return instance(token).post(http.makeworldFavourite, payload);
  };

  const getPromotedGames=(token)=>{
    return instance(token).get(http.getPromotedGames);
  }
  const getMostPlayedGame=(token)=>{
    return instance(token).get(http.getMostPlayedGame);
  }
  const getFavouriteworld=(token)=>{
    return instance(token).get(http.getFavouriteworld);
  }
  const getSimillarWorld=(token)=>{
    return instance(token).get(http.getSimillarWorld);
  }
  const removeWorldFromFav=(payload,token)=>{
    return instance(token).patch(http.removeWorldFromFav,payload);
  }
  export default {
    makeworldFavourite,
    getPromotedGames,
    getMostPlayedGame,
    getFavouriteworld,
    removeWorldFromFav,
    getSimillarWorld
  };