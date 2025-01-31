import React, { useState, useEffect, useRef } from "react";
import NftCard from "./NftCard";
import axios from "axios";
import { contractsByBaseContract } from "../../configs/collections";

const GRID_OPTIONS = {
  LARGE: "LARGE",
  SMALL: "SMALL",
};

const UserCollection = ({ gridView, address }) => {
  const [tokens, setTokens] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
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
    if (isLoading) return;

    try {
      setIsLoading(true);
      const response = await axios.get(`/api/accounts/${address}/nfts`, {
        params: { skip },
      });

      const newTokens = response.data.nfts.filter(
        (nft) =>
          nft.collection?.address !==
          "pasg14rse3e7rkc3qt7drmlulwlkrlzqvh7hv277zv05kyfuwl74udx5s5gxtz3"
      );

      setTokens((prev) => [...prev, ...newTokens]);
      setHasMore(newTokens.length > 0);
      setSkip((prev) => prev + response.data.nfts.length);
    } catch (err) {
      console.log("err", err);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const observer = useRef(null);

  useEffect(() => {
    if (hasMore && !isLoading) {
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadTokens();
          }
        },
        { threshold: 0.5 }
      );

      const target = document.querySelector(".infinite-scroll-trigger");
      if (target && observer.current) {
        observer.current.observe(target);
      }
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, isLoading]);

  useEffect(() => {
    if (address) {
      setTokens([]);
      setSkip(0);
      setHasMore(true);
      loadTokens();
    }
  }, [address]);

  return (
    <>
      {tokens.map((nft, index) => {
        const baseContract = nft.collection?.address || "";
        return (
          <div
            style={{
              flex: GRID_OPTIONS.SMALL === gridView ? "18%" : "23%",
              maxWidth: calculateMinMaxWidth(),
              cursor: "pointer",
            }}
            key={`${nft.id}-${index}`}
          >
            <NftCard
              cached={true}
              data={nft}
              tokenId={nft.tokenId}
              baseContract={baseContract}
              marketContract={
                contractsByBase[baseContract]?.contracts?.market || ""
              }
            />
          </div>
        );
      })}
      {hasMore && <div className="infinite-scroll-trigger" />}
      {isLoading && <p style={{ color: "#fff", fontSize: 18 }}>Loading...</p>}
    </>
  );
};

export default UserCollection;
