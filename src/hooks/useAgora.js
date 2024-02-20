import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import accountService from "../services/account";
import { setAgoraToken } from "../redux/accountSlice";

export default function useAgora(props) {
  const account = useSelector((state) => state.account);
  const dispatch = useDispatch();

  useEffect(() => {
   
  }, [account.id]);
}
