import React from "react";
import { Modal } from "antd";

import CloseIcon from "../../assets/images-v2/close-modal.svg";
import StrangeClanLogo from "../../assets/images-v2/strange-clan-sm.png";
import MetahuahuaLogo from "../../assets/images-v2/metahuahuaLogo.png";

const ViewNft = ({
  show,
  handleClose,
  nftDetails,
  handleViewOnMarketplace,
}) => {
  return (
    <Modal
      title=""
      visible={show}
      onCancel={handleClose}
      footer={null}
      className="view-nft-container"
      closeIcon={<img src={CloseIcon} style={{ width: 15, height: 15 }} />}
      centered
    >
      <div className="vn-header">{nftDetails?.name}</div>
      <div className="vn-content">
        <img
          className="vn-nft-image"
          src={nftDetails?.image}
          alt={nftDetails?.name}
        />
        <div className="vn-nft-details-wrapper">
          <div className="nft-name">{nftDetails?.name}</div>
          <div className="collection-detail">
            <img
              src={
                nftDetails?.collectionName === "MetaHuahua"
                  ? MetahuahuaLogo
                  : StrangeClanLogo
              }
              alt="clan"
              className="clan-logo"
            />
            <span className="clan-name">{nftDetails?.collectionName}</span>
          </div>
          <div className="nft-token-id">{nftDetails?.tokenId}</div>
          <div className="nft-price">{nftDetails?.price}</div>
        </div>
      </div>
      <div className="vn-footer">
        <button
          className="vn-marketplace-btn"
          onClick={handleViewOnMarketplace}
        >
          View on Marketplace
        </button>
      </div>
    </Modal>
  );
};

export default ViewNft;
