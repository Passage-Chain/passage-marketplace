const contractConfig = {
  PRICE_FEED_API: "https://api.coingecko.com/api/v3/simple/price",
  RPC: "https://rpc.passage.vitwit.com/",
  chainId: "passage-2",
  DENOM: "pasg",
  //DENOM: "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
  RPC_COSMOS:
    "https://j1n8kqgxvc.execute-api.us-east-2.amazonaws.com/test-proxy",
  IPFS_ROOT: "https://ipfs.io/ipfs/",
  KEPLR_JUNO_WALLET: `https://lcd-juno.keplr.app/cosmos/bank/v1beta1`,
  NFT_API: "https://nft-api.app.passage.io/v2",
  NFT_INDEXER: "https://indexer.passage-apis.com/v1",
  ZENSCAN_BASE_URL: "https://passage.zenscan.io/transaction.php?hash=",
};

export default contractConfig;
