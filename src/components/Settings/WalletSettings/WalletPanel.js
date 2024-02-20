import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Modal, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as CloseIcon } from "../../../assets/images/icon-close.svg";
import KeplrIcon from "../../../assets/images/icon-kepler.png";
import FalconIcon from "../../../assets/images/icon-falcon.png";
import CosmoIcon from "../../../assets/images/icon-cosmo.png";
import "./index.scss";
import Wallet from "../../../services/wallet";
import { setAddress, setNftConnected } from "../../../redux/walletSlice";
import accountService from "../../../services/account";
import Contract from "../../../services/contract";
import { handleApiError } from "../../utils/AuthVerify/AuthVerify";
import accountHttpService from "../../../services/account"
import Toast from "../../custom/CustomToast";
import Loader from "../../Loader";

const WalletPanel = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [walletType, setWalletType] = useState('');
  const [haveNft, setHaveNft] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const dispatch = useDispatch();

  const connentWallet = async (walletType) => {

    try {
      setIsLoading(true);
      setWalletType(walletType);
      const walletAddress = await Wallet.connectWallet(walletType);
      dispatch(setAddress(walletAddress));
      if (walletAddress) {
        accountHttpService.addWallet(walletAddress, walletType).then((response) => {
          if (response.status === 200 && response.data) {
            setIsSuccess(true);
            setIsLoading(false);
            setHasLoaded(true);
            props.saveWallet();
          }

        }, (error) => {
          setIsSuccess(false);
          setIsLoading(false);
          setHasLoaded(true);
          //if(error.status === 500)
            Toast.error('Error', "wallet with given address already exists");
        })
      } else {
        setIsSuccess(false);
        setIsLoading(false);
        setHasLoaded(true);
        Toast.error('Error', 'There is no wallet address found');
      }

    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setHasLoaded(true);
      handleApiError(err);
    }
  };

  const handleCancel = () => {
    if (isSuccess && haveNft) {
      dispatch(setNftConnected(true));
    } else {
      setIsModalVisible(false);
      props.onCancel(false);
    }
  };

  const renderLinkWallet = () => {
    return (
      <div className="link-wallet-content">
        <div className="wp-wallet-options-wrapper">
          <div className="falcon-icon-wrapper" >
            <Tooltip
              placement="bottom"
              title={"Keplr"}
            >
              <img src={KeplrIcon} onClick={() => connentWallet("keplr")} alt="keplr" />
            </Tooltip>

          </div>
          {/*<Tooltip
            placement="bottom"
            title={"Cosmostation"}
          >
            <img src={CosmoIcon} onClick={() => connentWallet("cosmos")} alt="cosmostation" />
          </Tooltip>
          <Tooltip
            placement="bottom"
            title={"Falcon"}
          >
            <img src={FalconIcon} onClick={() => connentWallet("falcon")} alt="falcon" />
          </Tooltip>*/}
        </div>
      </div>
    );
  };

  const renderLoader = () => {
    return (
      <div className="loader-wrapper">
        <Loader />
        <span>Linking your wallet...</span>
      </div>
    );
  };

  const renderResponse = () => {
    return (
      <div className="response-content">
        <div className="link-wallet-icon-wrap text-align-center">
          {walletType === 'keplr' && <img src={KeplrIcon} alt='Keplr'/>}
          {walletType === 'falcon' && <img src={FalconIcon} alt='falcon'/>}
          {walletType === 'cosmos' && <img src={CosmoIcon} alt='cosmostation'/>}
        </div>
        <div className="wallet-sub-text text-align-center">
          <span>
            {!isSuccess && "Oops! Your Wallet was not linked!"}
            {isSuccess && (
              <>
                Your wallet was successfully linked!
              </>
            )}
          </span>
        </div>
      </div>
    );
  };

  return (
    <Modal
      className="n-wallet-container"
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      title="LINK A WALLET"
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

export default WalletPanel;
