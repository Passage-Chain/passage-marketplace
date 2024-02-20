import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as CloseIcon } from "../../assets/images/icon-close.svg";
import { ReactComponent as LinkWalletIcon } from "../../assets/images/icon-link-wallet.svg";
import { ReactComponent as SuccessFaceIcon } from "../../assets/images/icon-success-face.svg";
import { ReactComponent as FailureFaceIcon } from "../../assets/images/icon-failed-face.svg";
import KeplrIcon from "../../assets/images/icon-kepler.png";
import FalconIcon from "../../assets/images/icon-falcon.png";
import CosmoIcon from "../../assets/images/icon-cosmo.png";
import "./index.css";
import Wallet from "../../services/wallet";
import { setAddress, setNftConnected } from "../../redux/walletSlice";
import accountService from "../../services/account";
import Contract from "../../services/contract";
import LoaderImage from "../../assets/images/loader.png";
import { handleApiError } from "../utils/AuthVerify/AuthVerify";

const eventName = "Office";

const Gating = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [eventDetails, setEventDetails] = useState(undefined);
  const [isSuccess, setIsSuccess] = useState(false);
  const [haveNft, setHaveNft] = useState(false);
  const [nftName, setNftName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    getEventDetails();
  }, []);

  const getEventDetails = async () => {
    try {
      const response = await accountService.getEventDetails(
        eventName
      );
      setEventDetails(response.data);
    } catch (err) {
      // if(err.response.status === 401 )
      //       history.push('/')
    }
  };

  const connentWallet = async (walletType) => {
    try {
      setIsLoading(true);
      const walletAddress = await Wallet.connectWallet(walletType);
      dispatch(setAddress(walletAddress));

      setIsSuccess(true);

      if (walletAddress && eventDetails && eventDetails?.nftRequired) {
        await getNFTs(walletAddress, walletType);
      }
      setIsLoading(false);
      setHasLoaded(true);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setHasLoaded(true);
      handleApiError(err);
    }
  };

  const getNFTs = async (walletAddress, walletType) => {
    try {
      const contract = Contract(
        "cosmwasm-stargate",
        eventDetails.blockchain,
        eventDetails.rpc,
        eventDetails.nftContractAddress,
        walletType
      );
      const service = await contract;
      const response = await service.getTokensByOwner(walletAddress);
      if (response?.tokens.length > 0) {

        const tokenData = await service.getTokenData(response.tokens[0]);
        setNftName(tokenData?.info?.extension?.name);
        setHaveNft(true);
      }
    } catch (err) {
      console.log(err);
      setIsSuccess(false);
      handleApiError(err);
    }
  };

  const handleCancel = () => {
    if (isSuccess && haveNft) {
      dispatch(setNftConnected(true));
    } else {
      setIsModalVisible(false);
      props.onCancel(false);
      //history.push('/')
    }
  };

  const handleTryAnotherWallet = () => {
    setIsSuccess(false);
    setHaveNft(false);
    setHasLoaded(false);
  };

  const handleContinue = () => {
    dispatch(setNftConnected(true));
  };

  const renderLinkWallet = () => {
    return (
      <div className="link-wallet-content">
        <div className="link-wallet-icon-wrap text-align-center">
          <LinkWalletIcon />
        </div>
        <div className="wallet-text text-align-center">
          <span>LINK WALLET</span>
        </div>
        <div className="wallet-sub-text text-align-center">
          <span>Please select a wallet to continue</span>
        </div>
        <div className="wallet-options-wrapper">
          <img src={KeplrIcon} onClick={() => connentWallet("keplr")} alt="Keplr"/>
          <div
            className="falcon-icon-wrapper"
            onClick={() => connentWallet("falcon")}
          >
            <img src={FalconIcon} alt="Falcon"/>
          </div>
          <img src={CosmoIcon} onClick={() => connentWallet("cosmos")} alt='Cosmostation'/>
        </div>
      </div>
    );
  };

  const renderLoader = () => {
    return (
      <div className="loader-wrapper">
        <img src={LoaderImage} alt="loader" />
        <span>Linking your wallet...</span>
      </div>
    );
  };

  const renderResponse = () => {
    return (
      <div className="response-content">
        <div className="link-wallet-icon-wrap text-align-center">
          {isSuccess ? <SuccessFaceIcon /> : <FailureFaceIcon />}
        </div>
        <div className="wallet-text text-align-center">
          <span>{isSuccess ? "WALLET LINKED" : "WALLET NOT LINKED"}</span>
        </div>
        <div className="wallet-sub-text text-align-center">
          <span>
            {isSuccess && haveNft && (
              <>
                Your wallet was successfully linked and you're holding the{" "}
                <span style={{ color: "fff", fontWeight: 600 }}>{nftName}</span>{" "}
                required for this event.
              </>
            )}
            {!isSuccess && "Oops! Your Wallet was not linked!"}
            {isSuccess && !haveNft && (
              <>
                Sorry, you are not currently holding the{" "}
                <span style={{ color: "fff", fontWeight: 600 }}>
                  {eventName} NFT
                </span>{" "}
                required for access to this event.
              </>
            )}
          </span>
        </div>
        <div className="wallet-options-wrapper">
          <div className="options-sub-wrapper">
            {isSuccess && haveNft && (
              <Button className="action-btn" onClick={handleContinue}>
                <span>CONTINUE</span>
              </Button>
            )}
            {(!isSuccess || (isSuccess && !haveNft)) && (
              <Button className="action-btn" onClick={handleTryAnotherWallet}>
                <span>TRY ANOTHER WALLET</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal
      className="gating-container"
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      title=""
      closeIcon={<CloseIcon />}
      centered
      maskClosable={false}
    >
      {isLoading
        ? renderLoader()
        : hasLoaded
        ? renderResponse()
        : renderLinkWallet()}
    </Modal>
  );
};

export default Gating;
