import contractConfig from "../configs/contract";
import Wallet from "./wallet";
import { coin } from "@cosmjs/proto-signing";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { SigningStargateClient } from "@cosmjs/stargate";
import { toUtf8 } from "@cosmjs/encoding";
import { Decimal } from "@cosmjs/math";
import Toast from "../components/custom/CustomToast";

const makeConnection = async (
  signingClient,
  chainId,
  RPC = contractConfig.RPC,
  walletType = "keplr"
) => {
  return new Promise(async (resolve) => {
    const offlineSigner = await Wallet.getOfflineSigner(chainId, walletType);
    const walletAddress = await Wallet.connectWallet(walletType, chainId);
    if (!walletAddress && !offlineSigner) {
      //Toast.error("Wallet connection failed.")
      return;
    }
    let client;
    if (signingClient === "cosmwasm-stargate") {
      client = await SigningCosmWasmClient.connectWithSigner(
        RPC,
        offlineSigner,
        {
          gasPrice: {
            amount: Decimal.fromUserInput("0.0025", 100),
            denom: "PASG", //contractConfig.denom,
          },
        }
      );
    } else {
      client = await SigningStargateClient.connectWithSigner(
        contractConfig.RPC,
        offlineSigner,
        {
          gasPrice: {
            amount: Decimal.fromUserInput("0.0025", 100),
            denom: "PASG", //, contractConfig.denom,
          },
        }
      );
    }

    resolve({ offlineSigner, walletAddress, client });
  });
};

const useContract = async (
  signingClient = "cosmwasm-stargate",
  chainId = contractConfig.chainId,
  RPC = contractConfig.RPC,
  contractAddress,
  walletType
) => {
  const { client, walletAddress } = await makeConnection(
    signingClient,
    chainId,
    RPC,
    walletType
  );

  const baseContract = contractAddress || contractConfig.BASE_CONTRACT;

  const buyNFT = async (tokenId, price, marketplaceContract) => {
    try {
      const amount = Number(price);

      const fee = {
        amount: [{ amount: "5000", denom: "upasg" }],
        gas: "5000000",
      };

      const txMsg = {
        set_bid: {
          token_id: tokenId.toString(),
          price: {
            amount: (price * 1000000).toString(),
            denom: "upasg",
          },
        },
      };

      const result = await client.execute(
        walletAddress,
        marketplaceContract,
        txMsg,
        fee,
        "",
        [coin(parseInt(amount * 1000000), "upasg")]
      );

      return result.transactionHash;
    } catch (err) {
      // this doesn't work
      // Toast.contractError(err);
      console.log(err);
    }
  };

  const getMintConfig = async (
    contract = contractConfig.NETA_MINTING_CONTRACT
  ) => {
    const response = await client.queryContractSmart(contract, {
      config: {},
    });
    // Override the default config max num tokens for Town 2 minting contract
    if (
      contract ===
      "juno195qvjp8p545aghtzs3l5x45vjrzl5rjnj8zwm4dyvrtn6upks2qsc93s2t"
    ) {
      response.max_num_tokens = 5000;
    }
    return response;
  };

  const getMintedCount = async (contract) => {
    // Override the mint count logic for Town 2 minting contract
    if (
      contract ===
      "pasg1dc0ucfe5xuu0tw7dcy3t75qwcngec7kmhyn3ngawgpnrn29gqgusk6c84w"
    ) {
      const numMintedLegacyContract = 1739;
      const response = await client.queryContractSmart(contract, {
        num_remaining: {},
      });
      const numMintedCurrentContract = 3165 - response.num_remaining;
      return { num_minted: numMintedLegacyContract + numMintedCurrentContract };
    }
    return client.queryContractSmart(contract, {
      num_minted: {},
    });
  };

  const delistTokens = async (tokenId, marketplaceContract) => {
    const txMsg = {
      remove_ask: {
        token_id: tokenId.toString(),
      },
    };

    const result = await client.execute(
      walletAddress,
      marketplaceContract,
      txMsg,
      "auto"
    );
    return result.transactionHash;
  };

  const getMarketplaceConfig = async (
    marketplaceContract = contractConfig.MARKETPLACE_CONTRACT
  ) => {
    return client.queryContractSmart(marketplaceContract, {
      config: { config: {} },
    });
  };

  const getToken = async (
    tokenId,
    marketplaceContract = contractConfig.MARKETPLACE_CONTRACT
  ) => {
    return client.queryContractSmart(marketplaceContract, {
      ask: {
        token_id: tokenId,
      },
    });
    /*return client.queryContractSmart(marketplaceContract, {
      token: { id: tokenId },
    });*/
  };

  const getTokenData = async (tokenId, base = baseContract) => {
    return client.queryContractSmart(base, {
      all_nft_info: { token_id: tokenId },
    });
  };

  const getNumTokens = async (base) => {
    return client.queryContractSmart(base, {
      num_tokens: {},
    });
  };

  const getTokensByOwner = async (owner, base = baseContract) => {
    return client.queryContractSmart(base, {
      tokens: { owner, limit: 1000 },
    });
  };

  const getTokensByOwnerPaginated = async (
    owner,
    base = baseContract,
    start_after = "0"
  ) => {
    // Retrieve 30 (the contract max) tokens at a time
    return client.queryContractSmart(base, {
      tokens: { owner, limit: 30, start_after: start_after },
    });
  };

  const getWhitelistConfig = async (contract) => {
    return client.queryContractSmart(contract, {
      config: {},
    });
  };

  const mintNFT = async (wallet, price, mintingContract) => {
    const txMsg = { mint: {} };
    /*if (price.amount === "3300000") {
      price.amount = "2900000";
    }*/

    const fee = {
      amount: [{ amount: "5000", denom: "upasg" }],
      gas: "5000000",
    };

    const result = await client.execute(
      walletAddress,
      mintingContract,
      txMsg,
      fee,
      "",
      [coin(parseInt(price.amount), price.denom)]
      //[coin(price.amount, Endpoints.DENOM)]
    );

    return result;
  };

  const listTokens = async (
    tokenId,
    price,
    base = baseContract,
    marketplaceContract
  ) => {
    const txMsg = [
      {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: MsgExecuteContract.fromPartial({
          sender: walletAddress,
          contract: base,
          msg: toUtf8(
            JSON.stringify({
              approve: {
                spender: marketplaceContract,
                token_id: tokenId.toString(),
                expires: null,
              },
            })
          ),
          funds: [],
        }),
      },
      {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: MsgExecuteContract.fromPartial({
          sender: walletAddress,
          contract: marketplaceContract,
          msg: toUtf8(
            JSON.stringify({
              set_ask: {
                token_id: tokenId.toString(),
                price: { amount: price, denom: "upasg" },
                expires: null,
              },
            })
          ),
          funds: [],
        }),
      },
    ];

    const fee = {
      amount: [{ amount: "1000000", denom: "upasg" }],
      gas: "1000000",
    };

    try {
      //const result = await client.signAndBroadcast(walletAddress, txMsg, "auto");
      const result = await client.signAndBroadcast(
        walletAddress,
        txMsg,
        fee,
        ""
      );
      /*const result = await client.execute(
        walletAddress,
        marketplaceContract,
        txMsg,
        fee
      )*/
      return result;
    } catch (err) {
      Toast.contractError(err.message);
      console.log(err);
    }
  };

  const transferNFT = async (
    tokenId,
    recipientWalletAddress,
    baseContract = contractConfig.BASE_CONTRACT
  ) => {
    // TODO: Town 1 nfts must be 0 padded while the rest of _must not be_.
    const txMsg = {
      transfer_nft: {
        recipient: recipientWalletAddress,
        token_id: tokenId.toString(), //parseInt(tokenId).toString(),
      },
    };

    try {
      const fee = {
        amount: [{ amount: "5000", denom: "upasg" }],
        gas: "500000",
      };

      const res = await client.execute(walletAddress, baseContract, txMsg, fee);

      return res.transactionHash;
    } catch (err) {
      Toast.contractError(err.message);
      console.log(err);
      return null;
    }
  };

  const updatePrice = async (tokenId, price, marketplaceContract) => {
    try {
      const fee = {
        amount: [{ amount: "5000", denom: "upasg" }],
        gas: "500000",
      };

      const txMsg = {
        set_ask: {
          price: { amount: price, denom: "upasg" },
          token_id: tokenId.toString(),
        },
      };

      const result = await client.execute(
        walletAddress,
        marketplaceContract,
        txMsg,
        fee
      );

      return result;
    } catch (err) {
      console.log(err);
    }
  };

  return {
    buyNFT,
    delistTokens,
    getMarketplaceConfig,
    getTokenData,
    getToken,
    getNumTokens,
    getTokensByOwner,
    getTokensByOwnerPaginated,
    getMintConfig,
    getMintedCount,
    getWhitelistConfig,
    mintNFT,
    listTokens,
    transferNFT,
    updatePrice,
  };
};

export default useContract;
