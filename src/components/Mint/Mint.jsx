import { useState, useEffect } from "react";
import { collectionForMintContract } from "src/configs/collections";
import useWalletAddress from "../../hooks/useWalletAddress";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import useContract from "../../services/contract";
import Toast from "../custom/CustomToast";
import "./index.scss";

const confirmButtonStyle = {
  background: "#FCC672 0% 0% no-repeat padding-box",
  border: "2px solid #FCC672",
  borderRadius: "8px",
  font: "normal normal 300 25px/29px niveau-grotesk",
  color: "#000000",
  width: "100%",
  height: "50px",
  marginTop: "30px",
};

function Mint() {
  const { mintContract } = useParams();
  const [collection, setCollection] = useState();
  const [config, setConfig] = useState({});
  const walletAddress = useWalletAddress();
  const contract = useContract("cosmwasm-stargate");
  const navigate = useNavigate();
  const [status, setStatus] = useState("Starting soon");

  const mintNFT = () => {
    // setIsLoading(true)
    const addr = walletAddress;
    const collection = collectionForMintContract(mintContract);

    contract.then(({ mintNFT, getTokenData, getToken }) => {
      mintNFT(addr, config.unit_price, collection.contracts.mint)
        .then(async (res) => {
          //const res = await contract.listTokens(token.id, String(data.price * 1000000))
          const tokenId = res.logs[0]?.events
            ?.find((e) => e.type === "wasm")
            ?.attributes?.find((a) => a.key === "token_id")?.value;

          // TODO: not sure if this will be static of if it needs to be like ^
          // const contractAddress = res.logs[0].events[2].attributes[1].value;
          if (tokenId) {
            Toast.success(
              "NFT Succesfully Minted",
              `Item was successfully minted! ${tokenId}`,
              {
                /*logo: <img src={StrangeClan} alt="Success" />,*/
                handleClick: () =>
                  navigate(
                    `/marketplace/${collection.contracts.base}/${tokenId}`
                  ),
              }
            );
          }
        })
        .catch((err) => {
          Toast.contractError(err.message);
          console.log(err, err.message);
        });
    });
  };

  const getMintConfig = async (collection) => {
    const service = await contract;
    let res;
    const t = Date.now() * 1000000;

    if (collection.contracts.whitelist) {
      res = await service.getWhitelistConfig(collection.contracts.whitelist);
    }

    // If there is no whitelist or the whitelist has ended
    if (!collection.contracts.whitelist || t > res.end_time) {
      res = { start_time: 0, end_time: 0 };
    }
    let res2 = await service.getMintConfig(collection.contracts.mint);
    const num_minted_result = await service.getMintedCount(
      collection.contracts.mint
    );

    const num_tokens = await service.getNumTokens(collection.contracts.base);

    /*if (collection.id === "metahuahua") {
      res2.max_num_tokens = 3333;
      res.totalCount = 3333;
    }*/
    setConfig({
      ...res,
      unit_price: res2.unit_price,
      max_num_tokens: res2.max_num_tokens,
      num_minted: num_minted_result.num_minted || 0,
      num_tokens: num_tokens?.count,
    });

    if (t < res.start_time) {
      setStatus("Starting soon");
    } else if (t > res.end_time) {
      res = await service.getMintConfig(collection.contracts.mint);
      setStatus("Public Sale");
    } else {
      setStatus("Whitelist Sale");
    }
  };

  useEffect(() => {
    const collection = collectionForMintContract(mintContract);

    setCollection(collection);
    getMintConfig(collection);
  }, [walletAddress, mintContract]);

  return (
    <>
      {/* {isLoading && <Loader isOpen={isLoading} />} */}
      <div className="explore-container">
        <div className="ex-header">
          <span className="ex-header-txt clickable">
            <span onClick={() => navigate("/marketplace")}>Marketplace</span>
            {" > "}
            <span onClick={() => navigate("/mint")}>Mints</span>
            {" > "}
            <span className="active">{collection?.label}</span>
          </span>
        </div>

        {collection && (
          <div
            className="row mint-view ex-content"
            style={{ justifyContent: "center" }}
          >
            <div className="col-12"></div>
            <div className="col-6 collection-card mint">
              <div className="row">
                <div className="col-5">
                  <video
                    playsInline
                    muted
                    loop
                    autoPlay
                    src={collection.mint.previewUrl}
                    className="preview"
                    {...(collection.mint.previewUrl.includes(".png")
                      ? { poster: collection.mint.previewUrl }
                      : {})}
                  />
                </div>
                <div className="col-7 mint-data">
                  <div className="mint-info">
                    <div className="mint-title">
                      {collection?.label || "Mint"}
                      <span>{status}</span>
                    </div>
                    <div className="creator">{collection.mint.creator}</div>
                    <div className="desc">
                      {collection.mint.description ||
                        "Town 2 of the Strange Clan NFT collection"}
                    </div>
                  </div>
                  <div className="data">
                    <div></div>
                    <div className="price">
                      <span className="txt">PRICE</span>
                      <span className="atom">
                        {collection.name === "Metahuahua"
                          ? "2.9"
                          : config?.unit_price?.amount &&
                            config?.unit_price?.amount / 1000000}
                        {/* <img src={AtomIcon} className="atom-icon" alt="ATOM" /> */}
                      </span>
                    </div>
                    <div className="metadata compact">
                      <table className="table table-borderless">
                        <tbody>
                          <tr>
                            <td colSpan="2">
                              <span className="label">NFT COUNT</span>
                              <span className="value">
                                {collection.mint.totalCount}
                                {/*config.totalCount || config.max_num_tokens*/}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <span className="label">Percent Minted</span>
                              <span className="value">
                                {config.num_tokens &&
                                  (
                                    (config.num_tokens /
                                      collection.mint.totalCount) *
                                    100.0
                                  ).toFixed(2)}
                                {/*!config.num_minted ||
                                !config.max_num_tokens ||
                                config.num_minted === 0
                                  ? "0"
                                  : (
                                      (config.num_minted /
                                        config.max_num_tokens) *
                                      100.0
                                  ).toFixed(2)*/}
                                %
                              </span>
                            </td>
                            <td>
                              <span className="label">Royalties</span>
                              <span className="value">
                                {collection.name === "Metahuahua"
                                  ? "10%"
                                  : "6%"}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <button
                      style={confirmButtonStyle}
                      onClick={mintNFT}
                      disabled={status === "Starting soon"}
                    >
                      {status === "Starting soon" ? "Minting Soon" : "MINT"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Mint;
