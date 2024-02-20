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

const getUserDetails = () => {
  return instance().get(http.getUserDetails);
};

const updateUserDetails = (payload) => {
  return instance().patch(http.updateUserDetails, payload)
}

const getControlData = () => {
  return instance().get(http.getControlData);
};

const updateControlData = (payload) => {
  return instance().patch(http.updateControlData, payload)
}

export default {
  getUserDetails,
  updateUserDetails,
  getControlData,
  updateControlData
};
