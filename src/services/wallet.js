import contractConfig from "src/configs/contract";

const getOfflineSigner = async (network, wallet) => {
  if (window && window.getOfflineSigner) {
    const signer = await window[wallet].getOfflineSignerAuto(network);
    signer.sigAmino = signer.sigAmino ?? signer.sign;
    return signer;
  } else {
    return;
  }
};

const getKeplrConfig = (network) => {
  if (network === "passage-2") {
    return {
      chainId: "passage-2",
      chainName: "Passage",
      rest: "https://api.passage.vitwit.com",
      rpc: "https://rpc.passage.vitwit.com",
      bip44: {
        coinType: 118,
      },
      currencies: [
        {
          coinDenom: "PASG",
          coinMinimalDenom: "upasg",
          coinDecimals: 6,
          coinGeckoId: "passage",
        },
      ],
      walletUrlForStaking: "https://resolute.vitwit.com/passage/staking",
      bech32Config: {
        bech32PrefixAccAddr: "pasg",
        bech32PrefixAccPub: "pasgpub",
        bech32PrefixValAddr: "pasgvaloper",
        bech32PrefixValPub: "pasgvaloperpub",
        bech32PrefixConsAddr: "pasgvalcons",
        bech32PrefixConsPub: "pasgvalconspub",
      },
      feeCurrencies: [
        {
          coinDenom: "PASG",
          coinMinimalDenom: "upasg",
          coinDecimals: 6,
          coinGeckoId: "passage",
          gasPriceStep: {
            low: 0,
            average: 0,
            high: 0.01,
          },
        },
      ],
      stakeCurrency: {
        coinDenom: "PASG",
        coinMinimalDenom: "upasg",
        coinDecimals: 6,
        coinGeckoId: "passage",
      },
      beta: true,
    };
  } else {
    return {
      chainId: network,
      rpc: "http://143.244.137.73:26657",
      rest: "http://143.244.137.73:1317",
      chainName: "Passage Testnet",
      stakeCurrency: {
        coinDenom: "PASG",
        coinMinimalDenom: "upasg",
        coinDecimals: 6,
      },
      bech32Config: {
        bech32PrefixAccAddr: "pasg",
        bech32PrefixAccPub: `pasgpub`,
        bech32PrefixValAddr: `pasgvaloper`,
        bech32PrefixValPub: `pasgvaloperpub`,
        bech32PrefixConsAddr: `pasgvalcons`,
        bech32PrefixConsPub: `pasgvalconspub`,
      },
      bip44: { coinType: 118 },
      coinType: 118,
      currencies: [
        {
          coinDenom: "PASG",
          coinMinimalDenom: "upasg",
          coinDecimals: 6,
        },
      ],
      feeCurrencies: [
        {
          coinDenom: "PASG",
          coinMinimalDenom: "upasg",
          coinDecimals: 6,
        },
      ],
    };
  }
};

const connectKeplr = async (network, walletType) => {
  if (!window.keplr) {
    return;
  }
  try {
    if (network === "passage-testnet-1" || network === "passage-2") {
      await window.keplr.experimentalSuggestChain(getKeplrConfig(network));
    }
    await window.keplr.enable(network);

    const offlineSigner = await getOfflineSigner(network, walletType);
    if (!offlineSigner) return;

    const account = await offlineSigner.getAccounts();
    return account[0]?.address;
  } catch (err) {
    console.log(err);
  }
};

const connectFalcon = async (network, walletType) => {
  if (!window.falcon) {
    return;
  }
  try {
    await window.falcon.enable(network);
    await window.falcon.connect(network);
    const offlineSigner = await window.falcon.getOfflineSigner(
      network,
      walletType
    );
    const accounts = await offlineSigner.getAccounts();
    return accounts[0]?.address;
  } catch (err) {
    console.log(err);
  }
};

const connectCosmos = async (chainName, walletType) => {
  if (!window.cosmostation) {
    return;
  }
  try {
    const account = await window.cosmostation.cosmos.request({
      method: "cos_account",
      params: { chainName },
    });
    return account.address;
  } catch (err) {
    console.log(err);
  }
};

const connectWallet = async (
  walletType = "keplr",
  network = contractConfig.chainId
) => {
  let address;

  switch (walletType) {
    case "keplr":
      address = await connectKeplr(network, walletType);
      break;
    case "falcon":
      address = await connectFalcon(network, walletType);
      break;
    case "cosmos":
      address = await connectCosmos(network, walletType);
      break;
    default:
      break;
  }

  return address;
};

const Wallet = {
  connectWallet,
  getOfflineSigner,
};

export default Wallet;
