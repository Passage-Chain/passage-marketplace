import { useState, useEffect } from "react";
import useContract from "../services/contract";
import useWalletAddress from "./useWalletAddress";

function useBalance() {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const wallet = useWalletAddress();
  const contract = useContract("cosmwasm-stargate");

  const fetchBalance = async () => {
    if (!wallet?.address) {
      setBalance(0);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const service = await contract;
      const balance = await service.getBalance(wallet.address, "upasg");

      // convert from microPASG (upasg) to PASG
      setBalance(Number(balance.amount) / 1_000_000);
    } catch (err) {
      console.error("Error fetching balance:", err);
      setBalance(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [wallet?.address]);

  return { balance, isLoading, refetch: fetchBalance };
}

export default useBalance;
