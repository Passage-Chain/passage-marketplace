import { useState } from "react";
import GameModal from "../shared/GameModal";
import Toast from "../custom/CustomToast";
import contractConfig from "../../configs/contract";
import useContract from "../../services/contract";
import { validateAddress } from "./utils";
import Loader from "../../components/Loader";
import { collectionForBaseContract } from "src/configs/collections";

const NftActionModal = ({
  setRefreshTokenData,
  visible,
  setVisible,
  actionType,
  image,
  owner,
  id,
  price,
  baseContract,
  marketContract,
  isOnSale,
  setPrice,
  nftTitle,
  setIsListOpen,
}) => {
  const collection = collectionForBaseContract(baseContract);
  const _id = collection?.offchainAssets ? id : parseInt(id).toString();
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    background: "#101010 0% 0% no-repeat padding-box",
    border: "2px solid #7CB5F924",
    borderRadius: "10px",
    font: "normal normal 300 18px/21px niveau-grotesk",
    color: "#C4C4C4",
    padding: "8px ",
    height: 45,
    width: "100%",
  };

  const [recipientAddress, setRecipientAddress] = useState("");
  const contract = useContract(
    "cosmwasm-stargate",
    contractConfig.chainId,
    contractConfig.RPC
  );

  let title, button;
  switch (actionType) {
    case "list":
      title = "List Item for Sale";
      button = "List for Sale";
      break;
    case "transfer":
      title = "Transfer NFT";
      button = "Transfer";
      break;
    case "edit":
      title = "Edit Item Price";
      button = "Edit Sale";
      break;
    case "buy":
      title = "Complete Your Purchase";
      button = "Complete Purchase";
      break;
    default:
      title = "";
      button = "";
  }

  const transferTokens = async () => {
    setLoading(true);
    const service = await contract;
    const validAddress = validateAddress(recipientAddress, owner);
    if (validAddress) {
      try {
        const txId = await service.transferNFT(
          _id,
          recipientAddress,
          baseContract
        );
        if (txId) {
          Toast.success(
            "Item Transferred",
            `Item was successfully transfered! ${txId}`
          );
        }
      } catch {}
    } else {
      Toast.error(
        "Transfer Failed",
        `Please verify the recipient address and try again`
      );
    }
    setIsListOpen(false);
    setLoading(false);
    setRefreshTokenData(true);
  };

  const buyToken = async () => {
    const service = await contract;
    setLoading(true);
    try {
      const txId = await service.buyNFT(_id, price, marketContract);
      if (txId) {
        Toast.success(
          "Item Purchased",
          `Item was successfully purchased! ${txId}`
        );
      } else {
        Toast.error(
          "Purchase Failed",
          "Please make sure there are enough funds in your wallet and try again"
        );
      }
    } catch {}
    setIsListOpen(false);
    setLoading(false);
    setRefreshTokenData(true);
  };

  const listTokens = async () => {
    setLoading(true);
    const service = await contract;

    try {
      // TODO: Test if listTokens can be used for updatePrice operations
      let txId;
      if (isOnSale) {
        txId = await service.updatePrice(
          _id,
          String(price * 1000000),
          marketContract
        );
        Toast.success(
          "Listing Succesfully Updated",
          // TODO: txId.transactionHash can be a URL to scanner tx
          `Item was successfully updated! ${txId.transactionHash}`
        );
      } else {
        txId = await service.listTokens(
          _id,
          String(price * 1000000),
          baseContract,
          marketContract
        );
        Toast.success(
          "NFT Succesfully Listed",
          // TODO: txId.transactionHash can be a URL to scanner tx
          `Item was successfully listed! ${txId.transactionHash}`
        );
      }
    } catch {}
    setIsListOpen(false);
    setLoading(false);
    setRefreshTokenData(true);
  };

  const handleAction = () => {
    if (actionType === "transfer") {
      return transferTokens();
    } else if (actionType === "buy") {
      return buyToken();
    } else {
      return listTokens();
    }
  };
  return (
    <GameModal
      visible={visible}
      setVisible={setVisible}
      title={title}
      listModal={true}
      confirmLabel={"List"}
      onCancel={() => setLoading(false)}
    >
      <div className="list-nft">
        <div className="nft-block">
          <div>
            <img src={image} className="" alt="Character" />
          </div>
          <div className="nft-info">
            <div
              style={{
                font: "normal normal bold 35px/41px niveau-grotesk",
                color: "#FCC672",
              }}
            >
              {nftTitle}
            </div>
            <div
              style={{
                font: "normal normal 300 15px/18px niveau-grotesk",
                color: "#C4C4C4",
              }}
            >
              &#x23;{id}
            </div>
            {/*<p className="owner">
              Owned By: <span>{shortenAddress(owner, 10)}</span>
            </p>*/}
            {/* HIDE IF ITS TRANSFER */}
            <div className="price-input" style={{ gap: 15 }}>
              {(() => {
                switch (actionType) {
                  case "transfer":
                    return (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            font: "normal normal bold 20px/18px niveau-grotesk",
                            color: "#7CB5F9",
                            width: "100%",
                            padding: "4px 0",
                          }}
                        >
                          <span style={{ flex: 1 }}>Recipient</span>
                        </div>

                        {/* TODO: Add better form handling, (or an actual form)  */}

                        <input
                          className="price-input"
                          type="text"
                          value={recipientAddress}
                          style={inputStyle}
                          onInput={(e) => {
                            setRecipientAddress(e.target.value);
                          }}
                        />
                      </div>
                    );
                  case "buy":
                    return (
                      <div>
                        <label
                          style={{
                            font: "normal normal 300 16px/19px niveau-grotesk",
                            color: "#C4C4C4",
                            marginBottom: "15px",
                            marginTop: "20px",
                          }}
                        >
                          CURRENT PRICE
                        </label>
                        <div style={{ display: "flex", gap: "0.75em" }}>
                          <div
                            className="atom"
                            style={{
                              font: "normal normal bold 35px/26px niveau-grotesk",
                              color: "#FCC672",
                              marginBottom: "15px",
                            }}
                          >
                            {price}
                          </div>

                          <div
                            style={{
                              font: "normal normal bold 35px/26px niveau-grotesk",
                              color: "#FCC672",
                              marginBottom: "15px",
                            }}
                          >
                            PASG
                          </div>
                        </div>
                      </div>
                    );

                  default:
                    return (
                      <>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            // gap: 5,
                            height: 70,
                          }}
                        >
                          {/* TODO: Add better form handling, (or an actual form)  */}
                          <input
                            className="price-input"
                            type="text"
                            value={price}
                            inputMode="numeric"
                            style={inputStyle}
                            pattern="[0-9]*"
                            onInput={(e) => {
                              const { value } = e.target;
                              // TODO: add a better validator here
                              e.target.value = value.replace(/[^0-9]/g, "");
                              setPrice(e.target.value);
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            font: "normal normal bold 20px/18px niveau-grotesk",
                            color: "#7CB5F9",
                          }}
                        >
                          <span style={{ flex: 1 }}>Price</span>

                          <span>PASG</span>

                          <span
                            style={{
                              font: "normal normal normal 15px/18px niveau-grotesk",
                              color: "#C4C4C4",
                              verticalAlign: "bottom",
                            }}
                          >
                            {/* {renderConvertedPrice()} */}
                          </span>
                        </div>
                      </>
                    );
                }
              })()}
            </div>
          </div>
        </div>
        <div className="buttons">
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <Loader />
            </div>
          ) : (
            <button
              className="modal-button confirm"
              onClick={handleAction}
              disabled={
                (actionType === "transfer" && !recipientAddress) ||
                (actionType === "list" && !price)
              }
            >
              {button}
            </button>
          )}
          <button
            className="modal-button cancel"
            onClick={() => {
              setLoading(false);
              setIsListOpen(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </GameModal>
  );
};

export default NftActionModal;
