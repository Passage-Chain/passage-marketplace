import { useState, useEffect } from "react";
import contractConfig from "../configs/contract";

// Helper function to convert IPFS URI to HTTP URL
const imageHttpUrl = (uri = "") => {
  if (uri.includes("ipfs://")) {
    return `${contractConfig.IPFS_ROOT}${uri.replace(
      "ipfs://",
      ""
    )}?img-width=512&img-quality=60`;
  }

  if (uri.includes(".png")) {
    return uri.replace("previews", "thumbs").replace(".png", ".jpg");
  }
};

export const useNftImage = (data, baseContract, type = "thumbs") => {
  const [imageUrl, setImageUrl] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (data?.metadata?.image) {
      if (
        baseContract ===
        "pasg1kwdranvwf6vl2grh99layugwdnph6um2x0c0l8qyvrcgsjcykuhs6vaz9p"
      ) {
        const paddedTokenId = data.tokenId.toString().padStart(5, "0");
        setImageUrl(
          `/s3/marketplace/nfts/${baseContract}/${type}/${paddedTokenId}.jpg`
        );
      } else {
        setImageUrl(imageHttpUrl(data.metadata.image));
      }
    }
  }, [data?.metadata?.image, baseContract, data?.tokenId, type]);

  const handleImageLoad = () => setLoaded(true);

  return { imageUrl, loaded, handleImageLoad };
};
