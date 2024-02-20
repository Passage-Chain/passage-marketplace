import dotenv from 'dotenv';
dotenv.config()

const contractConfig = {
  PRICE_FEED_API: "https://api.coingecko.com/api/v3/simple/price",
  //RPC: "https://juno-rpc.stakely.io",
  //RPC: "http://143.244.137.73:26657",
  //RPC: "https://rpc.passage.vitwit.com/",
  RPC: "https://rpc.passage.io",
  chainId: "passage-2",
  DENOM: "pasg",
  //DENOM: "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
  RPC_COSMOS:
    "https://j1n8kqgxvc.execute-api.us-east-2.amazonaws.com/test-proxy",
  //IPFS_ROOT: "https://cloudflare-ipfs.com/ipfs/",
  IPFS_ROOT: "https://pass2.mypinata.cloud/ipfs/",
  //IPFS_ROOT: "https://dweb.link/ipfs/",
  KEPLR_JUNO_WALLET: `https://lcd-juno.keplr.app/cosmos/bank/v1beta1`,
  //NFT_API: "http://localhost:3002/nfts/api/v1",
  NFT_API: "https://pc-portal.dev.passage3d.co/nfts/api/v1",
  MINTSCAN_BASE_URL: "https://www.mintscan.io/juno/txs/",
};

export default contractConfig;
