import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function useWalletAddress() {
  const jwtToken = useSelector((state) => state.account.token);
  const loggedInAddress = useSelector((state) => state.wallet.address);
  const localAddress = localStorage.getItem("active_address");
  const [address, setaddress] = useState(
    jwtToken ? loggedInAddress : localAddress
  );

  useEffect(() => {
    const updatedWallet = jwtToken ? loggedInAddress : localAddress;
    setaddress(updatedWallet);
  }, [jwtToken, loggedInAddress, localAddress]);

  return { address };
}

export default useWalletAddress;
