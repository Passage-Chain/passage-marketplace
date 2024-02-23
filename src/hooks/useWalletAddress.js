import { useEffect, useState } from "react";

function useWalletAddress() {
  const localAddress = localStorage.getItem("active_address");
  const [address, setaddress] = useState(localAddress);

  useEffect(() => {
    setaddress(localAddress);
  }, [localAddress]);

  return { address };
}

export default useWalletAddress;
