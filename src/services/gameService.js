import axios from "axios";
import http from "../configs/http";


function getSimilarGames(token) {
  return axios.get(http.getSimilarGames(), {
    headers: {
      Authorization: token,
    },
  })
}

export default {
  getSimilarGames,
};
