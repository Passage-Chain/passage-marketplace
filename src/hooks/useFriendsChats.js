import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  setId,
  clean,
  setIsSuperUser,
  setNeonName,
  setFriendsList,
} from "../redux/accountSlice";
import { setCustomizationItems } from "../redux/customizationSlice";

import accountService from "../services/account";
import chatService from "../services/chat";

export default function useFriendsChats(props) {
  const account = useSelector((state) => state.account);
  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    if (!account.token || !account.id || !account.agoraToken) {
      return;
    }

    console.debug("GET FRIENDS");

    function messageHandler() {}

    /*accountService.getFriendsList(account.token).then(
      async (response) => {
        console.debug(response);
        await chatService.create(account.id, account.agoraToken);

        console.debug("Creating chats");
        var friendsList = response.data[0].friendsList;

        friendsList
          .forEach((item) => {
            chatService.joinChannel(item, () => {});

            if (response.status === 401) {
              dispatch(clean());
              history.push("/");
            }
          })
          .catch((error) => console.error(error));
      },
      [account.token, account.id, account.agoraToken]
    );*/
  });
}
