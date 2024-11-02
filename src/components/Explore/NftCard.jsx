import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collectionForBaseContract } from "../../configs/collections";
import { useNftImage } from "../../hooks/useNftImage";
import PassageLogoIcon from "../../assets/images/left_menu_passageLogo.svg";

const NftCard = (props) => {
  const [data, setData] = useState(props.data);
  const [collection, setCollection] = useState();
  const navigate = useNavigate();
  const { imageUrl, loaded, handleImageLoad } = useNftImage(
    data,
    props.baseContract,
    "thumbs"
  );

  useEffect(() => {
    const c = collectionForBaseContract(props.baseContract);
    setCollection(c);
    loadNFT(props.tokenId, props.baseContract);
  }, [props.tokenId, props.baseContract]);

  const loadNFT = async (id, baseContract) => {
    try {
      let tokenData = props.data;
      setData(tokenData);
    } catch (error) {
      console.log(error);
    }
  };

  const formattedPrice = (tData) => {
    if (!tData?.listedPrice || tData.price === "0") return "-";
    let price = "-";
    if (tData.listedPrice) price = `${tData.listedPrice / 1000000}`;
    return price;
  };

  const padTokenId = (tokenId) => {
    return tokenId.toString().padStart(5, "0");
  };

  return (
    <div
      className="nft-card-container"
      onClick={(e) => {
        const paddedTokenId = padTokenId(data.tokenId);
        navigate(`/marketplace/${props.baseContract}/${paddedTokenId}`);
      }}
    >
      {collection && (
        <img
          style={loaded ? {} : { opacity: 0 }}
          src={imageUrl}
          className="nft-image"
          alt="Character"
          {...(collection?.offchainAssets ? {} : { crossOrigin: "anonymous" })}
          onLoad={handleImageLoad}
        />
      )}
      {!loaded && (
        <div className="loading">
          <img
            src={PassageLogoIcon}
            alt="loading"
            className="card-img-top img-fluid"
          />
        </div>
      )}

      <div
        style={{
          margin: "8px 15px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <span className="nft-name">{data?.metadata.name}</span>
        <span className="clan-name">{collection?.label}</span>
        <div className="nft-info-wrapper">
          <span className="price-txt">{formattedPrice(data)} PASG</span>
          <span className="nft-id">#{data?.tokenId}</span>
        </div>
      </div>
    </div>
  );
};

export default NftCard;
