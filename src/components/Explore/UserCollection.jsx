import React, { useState, useEffect, useRef } from "react";
import NftCard from "./NftCard";
import axios from "axios";
import contractConfig from "../../configs/contract";
import { contractsByBaseContract } from "src/configs/collections";
import useWalletAddress from "src/hooks/useWalletAddress";

const GRID_OPTIONS = {
  LARGE: "LARGE",
  SMALL: "SMALL",
};

const UserCollection = ({ gridView, address }) => {
  const [tokens, setTokens] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const contractsByBase = contractsByBaseContract();

  const calculateMinMaxWidth = () => {
    let width;
    if (GRID_OPTIONS.LARGE === gridView) {
      width = 484;
    } else if (GRID_OPTIONS.SMALL === gridView) {
      width = 338.48;
    }

    return width;
  };

  const loadTokens = async () => {
    try {
      const response = await axios.get(
        `${contractConfig.NFT_API}/wallet/${address}`,
        { params: { page } }
      );
      const tokens = response.data.data;
      if (tokens.length === 80) {
        setPage((prev) => prev + 1);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
      setTokens((prev) => [...prev, ...tokens]);
    } catch (err) {
      console.log("err", err);
    }
  };

  const observer = useRef(null);

  useEffect(() => {
    if (hasMore) {
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadTokens();
          }
        },
        { threshold: 1 }
      );

      if (observer.current) {
        observer.current.observe(
          document.querySelector(".infinite-scroll-trigger")
        );
      }
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore]);

  useEffect(() => {
    if (address) {
      loadTokens();
    }
  }, [address]);

  return (
    <>
      {tokens.map((nft) => (
        <div
          style={{
            flex: GRID_OPTIONS.SMALL === gridView ? "18%" : "23%",
            maxWidth: calculateMinMaxWidth(),
            cursor: "pointer",
          }}
          key={nft.id}
        >
          <NftCard
            cached={true}
            key={nft.id}
            data={nft}
            tokenId={nft.id}
            baseContract={nft.contract}
            marketContract={contractsByBase[nft.contract]?.contracts.market}
          />
        </div>
      ))}
      {/* {hasMore && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div className="ex-load-more-wrapper" onClick={loadTokens}>
            <span className="ex-load-more-label">Load more</span>
          </div>
        </div>
      )} */}

      {hasMore && <div className="infinite-scroll-trigger" />}
    </>
  );
};

export default UserCollection;
