import React, { Component, useEffect } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import accountHttpService from "../../../services/account"
import { useDispatch } from "react-redux";
import { setToken } from "../../../redux/accountSlice";
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

function AuthVerify (props) {
  const dispatch = useDispatch();
  // removed cookie
  useEffect(() => {
    props.history.listen(() => {
      const tokenData = localStorage.token;
      if (tokenData) {
        const decodedJwt = parseJwt(tokenData);

        if (decodedJwt.exp * 1000 < Date.now() && !sessionStorage.getItem('isLoggedOut')) {
          // props.logOut();
          sessionStorage.setItem('token', null);
          window.location.href = window.location.origin + '/';
          return;
        } else if (sessionStorage.getItem('isLoggedOut') === 'true') {
          getRToken();
        }
        //return error;

      }
    });
    axios.interceptors.response.use(undefined, async apiError => {
      console.log("apiError", '---> here');
      getRToken();
    });
  })

  const getRToken = () => {
    accountHttpService.getRefreshToken().then((response) => {
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data['token']}`;
      dispatch(setToken(response.data.token));
    });
  }

  return (<div></div>);

}

export default withRouter(AuthVerify);

export const handleApiError = (error) => {
  const isLoggedIn = sessionStorage.getItem('isLoggedOut') || false;
  if (error.message === 'Network Error') {
    // The user doesn't have internet
    return Promise.reject(error);
  }
  switch (error?.response?.status) {
    case 400:
      break;
    case 401:
      if (isLoggedIn === 'false') {
        localStorage.setItem('token', null);
        window.location.href = window.location.origin + '/';
        return;
      } 
     break;
    case 404:
      // Show 404 page
      break;
    case 500:
      // Server Error redirect to 500
      break;
    default:
      // Unknown Error
      break;
  }
  return Promise.reject(error);
}