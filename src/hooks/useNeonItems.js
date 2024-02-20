import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  setId,
  clean,
  setIsSuperUser,
  setNeonName,
} from "../redux/accountSlice";
import { setCustomizationItems } from "../redux/customizationSlice";

import accountService from "../services/account";

export default function useNeonItems(props) {
  const account = useSelector((state) => state.account);
  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    if (!account.token) {
      return;
    }

    console.debug("GET ITEMS")

    accountService
      .getNeonItems(account.token)
      .then((response) => {
        console.debug(response);
        if (response.status === 200) {
          let items = response.data;
          let reducedItems = items.map((item) => {
            return {
              id: item._id,
              name: item.name,
              imagePath: item.path,
              type: item.slot,
              addonId: item.addonId,
            };
          });

          dispatch(setCustomizationItems(reducedItems));
        }

        if (response.status === 401) {
          dispatch(clean());
          history.push("/");
        }
      })
      .catch((error) => console.error(error));
  }, [account.token]);
}
