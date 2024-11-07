import { useParams, useNavigate } from "react-router-dom";
import useContract from "../../services/contract";
import axios from "axios";
import contractConfig from "../../configs/contract";
import useWalletAddress from "../../hooks/useWalletAddress";
import ConfirmationModal from "./ConfirmationModal";
import NftActionModal from "./NftActionModal";
import {
  Accordion,
  Table,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
} from "reactstrap";
import {
  collectionForBaseContract,
  marketContractForBase,
} from "../../configs/collections";
import { useEffect, useState } from "react";
import Toast from "../custom/CustomToast";
import { useNftImage } from "../../hooks/useNftImage";

const classes = {
  table: {
    color: "#fff",
    borderBottomColor: "#16202D",
    marginBottom: 6,
  },
};

const NftDetails = () => {
  const { baseContract, id } = useParams();
  const navigate = useNavigate();
  const contract = useContract("cosmwasm-stargate");
  const [collection, setCollection] = useState();
  const [action, setAction] = useState(null);
  const [token, setToken] = useState(null);
  const [isListOpen, setIsListOpen] = useState(false);
  const [isConfirmationOpen, setisConfirmationOpen] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [open, setOpen] = useState("");
  const [marketData, setMarketData] = useState(null);
  const [owner, setOwner] = useState("");
  const [price, setPrice] = useState("");
  const marketContract = marketContractForBase(baseContract);
  const [refreshTokenData, setRefreshTokenData] = useState(false);
  const wallet = useWalletAddress();
  const isOwner =
    wallet &&
    (wallet?.address === token?.owner || wallet === marketData?.ask?.seller);
  const isOnSale = isOwner && marketData?.ask ? true : false;
  const onSale = marketData?.ask;

  const currentPriceText = marketData
    ? `${marketData?.ask?.price?.amount / 1000000.0}`
    : "-.-";

  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };

  const getTokenData = async () => {
    try {
      const response = await axios.get(
        `/api/collections/${baseContract}/nfts/${id}`
      );

      const token = response.data;

      setAttributes(token.metadata.attributes);
      setOwner(token.owner);
      setToken(token);
    } catch (err) {
      console.log("err", err);
    }

    let c = collectionForBaseContract(baseContract);

    setCollection(c);

    // Important! Town 1 NFTs have string ids that need to be 0 padded to 5 digits,
    // while newer NFT collections use integers, hence the following, ugly, code.
    const _id = c.offchainAssets ? id : parseInt(id).toString();

    if (wallet) {
      try {
        const service = await contract;
        const marketData = await service.getToken(_id, marketContract);
        if (marketData.ask) {
          setMarketData(marketData);
          if (marketData.ask.seller) {
            setOwner(marketData.ask.seller);
          }
          setPrice(marketData?.ask?.price?.amount / 1000000);
        }
      } catch (err) {
        console.log("err", err);
      }
    }
  };

  const showConfirmationModal = (newValue) => {
    setIsListOpen(newValue || !isListOpen);
  };

  const transferTokens = async () => {
    const service = await contract;
    let c = collectionForBaseContract(baseContract);
    const _id = c.offchainAssets ? id : parseInt(id).toString();

    try {
      const txId = await service.transferNFT(_id, "address", baseContract);
      Toast.success(
        "Listing Succesfully Updated",
        // TODO: txId.transactionHash can be a URL to scanner tx
        `Item was successfully updated! ${txId.transactionHash}`
      );
    } catch {}
  };

  useEffect(() => {
    getTokenData();
  }, []);

  useEffect(() => {
    if (refreshTokenData) {
      getTokenData();
      setRefreshTokenData(false);
    }
  }, [refreshTokenData]);

  const { imageUrl, loaded, handleImageLoad } = useNftImage(
    token,
    baseContract,
    "full"
  );

  return !collection ? (
    <></>
  ) : (
    <>
      <div className="explore-container">
        <div className="ex-header">
          <span
            className="ex-header-txt clickable"
            onClick={() => navigate("/")}
          >
            Marketplace
          </span>
          <button
            className="my-collection-btn"
            onClick={() => navigate("/marketplace/my-collection")}
          >
            My Collection
          </button>
        </div>
        <div className="row mt-4 ">
          <div className="col-12 col-md-5">
            <img
              style={loaded ? { width: "100%" } : { display: "none" }}
              src={imageUrl}
              className="img-fluid rounded nft-image"
              crossOrigin={collection?.offchainAssets ? undefined : "anonymous"}
              alt={token?.name || "Character"}
              onLoad={handleImageLoad}
            />
            {
              <div className="collections-metadata mt-4">
                <Accordion open={open} toggle={toggle} flush>
                  <AccordionItem>
                    <AccordionHeader targetId="1">Properties</AccordionHeader>
                    <AccordionBody accordionId="1">
                      <Table responsive style={{ ...classes.table }}>
                        <tbody>
                          {attributes?.map((t, index) => (
                            <tr key={index}>
                              <td colSpan="4" className="left-prop">
                                {t.trait_type}
                              </td>
                              <td colSpan="3" className="text-right">
                                {t.value.replaceAll("_", " ")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </AccordionBody>
                  </AccordionItem>
                </Accordion>
              </div>
            }
          </div>

          {
            <div className="col-12 col-md-7 mt-3 mt-md-0 text-white">
              <div
                className="fw-bold"
                style={{
                  fontSize: "45px",
                  lineHeight: "53px",
                  letterSpacing: "0px",
                  color: "rgb(252, 198, 114)",
                  marginBottom: "10px",
                }}
              >
                {/*collectionForBaseContract(baseContract).label*/}
                {token?.name}
                <div
                  className="fw-light"
                  style={{
                    fontSize: "20px",
                    lineHeight: "24px",
                    color: "rgb(196, 196, 196)",
                  }}
                >
                  #{token?.tokenId}
                </div>
              </div>
              <div className="owned-by-text" style={{ marginBottom: "32px" }}>
                Owned By: <span>{isOwner ? "You" : owner}</span>
              </div>
              <div className="action-items">
                <div className="item-1">
                  <div
                    style={{
                      display: "none",
                      marginBottom: "40px",
                      color: "#4B4B4B",
                    }}
                  >
                    {/* {auctionTimelineText} */} here
                  </div>
                  {wallet.address ? (
                    onSale ? (
                      <>
                        <div className="current-price-text">CURRENT PRICE</div>
                        <div className="price">
                          {currentPriceText}
                          <span className="atom"> PASG</span>
                        </div>
                      </>
                    ) : (
                      <div className="item-2">
                        This item is not currently for sale
                      </div>
                    )
                  ) : (
                    <div className="item-2">
                      Connect your wallet to view item availability.
                    </div>
                  )}
                  {isOwner ? (
                    <>
                      <button
                        className="contract-button"
                        onClick={() => {
                          isOnSale ? setAction("edit") : setAction("list");
                          setIsListOpen(true);
                        }}
                      >
                        {isOnSale ? "Edit Sale" : "List Item"}
                      </button>
                      {isOnSale && (
                        <button
                          className="contract-button"
                          onClick={() => setisConfirmationOpen(true)}
                        >
                          Cancel Sale
                        </button>
                      )}
                      <button
                        className="contract-button"
                        disabled={isOnSale}
                        onClick={() => {
                          setAction("transfer");
                          setIsListOpen(true);
                        }}
                      >
                        Transfer
                      </button>
                    </>
                  ) : (
                    <button
                      className="contract-button"
                      disabled={!onSale}
                      onClick={() => {
                        setAction("buy");
                        setIsListOpen(true);
                      }}
                    >
                      Buy Now
                    </button>
                  )}
                </div>
              </div>
              <div className="collections-metadata">
                <div>
                  <Accordion open={open} toggle={toggle} flush>
                    <AccordionItem>
                      <AccordionHeader targetId="2">
                        Price History
                      </AccordionHeader>
                      <AccordionBody accordionId="2">
                        <Table responsive style={{ ...classes.table }}></Table>
                      </AccordionBody>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div>
                  <Accordion open={open} toggle={toggle} flush>
                    <AccordionItem>
                      <AccordionHeader targetId="3">Listing</AccordionHeader>
                      <AccordionBody accordionId="3">
                        <Table responsive style={{ ...classes.table }}></Table>
                      </AccordionBody>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div>
                  <Accordion open={open} toggle={toggle} flush>
                    <AccordionItem>
                      <AccordionHeader targetId="4">Offers</AccordionHeader>
                      <AccordionBody accordionId="4">
                        <Table responsive style={{ ...classes.table }}></Table>
                      </AccordionBody>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>
          }
        </div>

        <NftActionModal
          setRefreshTokenData={setRefreshTokenData}
          visible={isListOpen}
          actionType={action}
          setVisible={showConfirmationModal}
          onCancel={showConfirmationModal}
          baseContract={baseContract}
          marketContract={marketContract}
          transferTokens={transferTokens}
          image={imageUrl}
          setPrice={setPrice}
          nftTitle={token && token.name}
          isOnSale={isOnSale}
          price={price}
          setIsListOpen={setIsListOpen}
          id={id}
          owner={owner}
        />
      </div>
      <ConfirmationModal
        visible={isConfirmationOpen}
        setVisible={setisConfirmationOpen}
        id={id}
        baseContract={baseContract}
        contract={contract}
        marketContract={marketContract}
      />
    </>
  );
};

export default NftDetails;
