import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  setId,
  clean,
  setIsSuperUser,
  setNeonName,
  setChatLink,
  setUsername,
  setEmail,
  setAvatar,
  setbriefInfo,
} from "../redux/accountSlice";

import accountService from "../services/account";
import SetCookie from "./cookies/SetCookies";
import RemoveCookie from "./cookies/RemoveCookies";
export default function useWhoami(props) {
  const account = useSelector((state) => state.account);
  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    if (!account.token) {
      return;
    }

    accountService
      .whoami(account.token)
      .then((response) => {
        console.debug(response);
        if (response.status === 200) {
          RemoveCookie("userDetails"); // removed cookies data
          SetCookie("useDetails", JSON.stringify(response.data));
          dispatch(setId(response.data.id));
          dispatch(setIsSuperUser(response.data.isSuper));
          dispatch(setNeonName(response.data.firstName));
          dispatch(setChatLink(response.data.chatConnectionString));
          dispatch(setUsername(response.data.nickname));
          dispatch(setEmail(response.data.email));
          dispatch(setAvatar(response.data.profileImage));
          dispatch(setbriefInfo(response.data.briefInfo));
        }

        if (response.status === 401) {
          dispatch(clean());
          dispatch(setUsername(""));
          RemoveCookie("userDetails");
          history.push("/");
        }
      })
      .catch((error) => {
        //console.log("cookies", cookies.remove('token', []));
        RemoveCookie("userDetails");
        dispatch(setUsername(""));
        console.error(error);
      });
  }, [account.token, dispatch, history]);
}
