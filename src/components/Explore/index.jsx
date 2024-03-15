import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { CustomSelect } from "../custom";
import NftCard from "./NftCard";
import UserCollection from "./UserCollection";
import SideFilter from "./SideFilter";

import contractConfig from "../../configs/contract";
import {
  collectionForCollectionName,
  contractsByBaseContract,
} from "../../configs/collections";
import useDebounce from "../../hooks/useDebounce";
import useWalletAddress from "../../hooks/useWalletAddress";
import { CustomSearchInput } from "../custom";

import ExpandFilterIcon from "../../assets/images-v2/expand-filter.svg";
import SmallGridIcon from "../../assets/images-v2/small-grid.svg";
import LargeGridIcon from "../../assets/images-v2/large-grid.svg";
import SearchIcon from "../../assets/images-v2/search.svg";
import "./index.scss";
import Toast from "../custom/CustomToast";
import { useNavigate } from "react-router-dom";

const SORT_OPTION = {
  PRICE: "price",
  TIME_LISTED: "lastListingTime",
  TIME_MINTED: "time minted",
};

const SORT_MODE = {
  ASC: "asc",
  DESC: "desc",
};

const sortOptions = [
  { id: SORT_MODE.DESC, label: "Price: high to low" },
  { id: SORT_MODE.ASC, label: "Price: low to high" },
];

const GRID_OPTIONS = {
  LARGE: "LARGE",
  SMALL: "SMALL",
};

const Explore = (props) => {
  const [filters, setFilters] = useState("");
  const [search] = useState("");
  const [sort] = useState("");
  const [nftList, setNftList] = useState([]);
  const [sortOption] = useState(SORT_OPTION.PRICE);
  const [sortOrder, setSortOrder] = useState(SORT_MODE.ASC);

  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [searchString, setSearchString] = useState("");
  const [setSelectedCollection] = useState("");

  // loggedInAddress since it condiitonally renders if user is logged in
  const { address: loggedInAddress } = useWalletAddress();

  const address = loggedInAddress;

  const [showFilterSider, setShowFilterSider] = useState(false);
  const [myCollection, setMyCollection] = useState(props.myCollection);
  const [gridView, setGridView] = useState(GRID_OPTIONS.LARGE);
  const [payload, setPayload] = useState({});
  const debouncedSearchText = useDebounce(searchString, 1000);
  const navigate = useNavigate();

  const contractsByBase = contractsByBaseContract();

  // TODO: Clean up wallet stuff
  // const activeWallet = address || wallet;

  useEffect(() => {
    fetchNftList(true, 1);
  }, [sortOrder, sortOption, payload, debouncedSearchText]);

  useEffect(() => {
    setNftList([]);
    // setPage(1);
    // setHasMore(true);
    const str = [filters, search, sort]
      .filter((s) => s)
      .reduce((s, r) => s + r, "");
    setSearchString(str);
  }, [sort, search, filters]);

  const toggleMyCollection = (show = !myCollection) => {
    if (show) {
      navigate("/marketplace/my-collection");
      setMyCollection(true);
    } else {
      navigate("/marketplace");
      setMyCollection(false);
    }
  };

  const updateFilterString = async (newFilter) => {
    setFilters(newFilter);
  };

  const fetchNftList = async (shouldReinitialize = false) => {
    try {
      const newPayload = {
        sortBy: sortOption,
        sortOrder: sortOrder,
        search: debouncedSearchText,
        page: shouldReinitialize ? 0 : page,
        ...payload,
      };

      if (shouldReinitialize || Object.keys(payload).length === 1) {
        setPage(0);
      }

      // Default to Kira on first load
      const baseContract =
        payload.collectionBase ||
        collectionForCollectionName("Strange Clan: Kira").contracts.base;
      const response = await axios.get(
        `${contractConfig.NFT_API}/nfts/${baseContract}`,
        { params: { ...newPayload } }
      );

      const tokens = response.data.data;
      //const tokens = response.data?.nftsWithFilteredDetails;

      // TODO: adjust this value
      if (tokens.length === 80) {
        setPage((prev) => prev + 1);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
      // If there an no more tokens and we're not reinitializing, return
      // if (!tokens || tokens.length <= 0) {
      //   setHasMore(false);
      //   if (!shouldReinitialize) {
      //     return;
      //   }
      // }

      if (!shouldReinitialize) {
        setNftList((prev) => [...prev, ...tokens]);
      } else {
        setNftList(tokens);
      }
    } catch (error) {
      Toast.error("error", error.response.data.message);

      if (error.response.status === 401) {
        navigate("/");
      }
      setNftList([]);
    }
  };

  useEffect(() => {
    setMyCollection(props.myCollection);
  }, [props]);

  const resetFilter = () => {
    setPayload({});
  };
  const observer = useRef(null);

  useEffect(() => {
    if (hasMore && !myCollection) {
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchNftList();
          }
        },
        { threshold: 1 }
      );

      if (observer.current) {
        observer.current.observe(
          document.querySelector(".infinity-explore-scroll")
        );
      }
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore]);

  const handleSearch = (str) => {
    if (str) {
      resetFilter();
    }
    setSearchString(str);
  };

  const toggleSider = () => {
    setShowFilterSider(!showFilterSider);
  };

  const calculateMinMaxWidth = () => {
    let width;
    if (GRID_OPTIONS.LARGE === gridView) {
      if (showFilterSider) {
        width = 383;
      } else {
        width = 484;
      }
    } else if (GRID_OPTIONS.SMALL === gridView) {
      if (showFilterSider) {
        width = 265.52;
      } else {
        width = 338.48;
      }
    }

    return width;
  };

  const renderSortOptions = () => {
    return (
      <CustomSelect
        className="border-white"
        options={sortOptions}
        value={sortOrder}
        onChange={(value) => setSortOrder(value)}
        style={{ width: 170 }}
      />
    );
  };

  const renderSearchInput = () => {
    return (
      <CustomSearchInput
        placeholder="Search..."
        onChange={handleSearch}
        value={searchString}
        maxLength={50}
        suffix={<img src={SearchIcon} alt="search icon" />}
      />
    );
  };

  return (
    <>
      <div className="explore-container">
        <div className="ex-header">
          <span className="ex-header-txt clickable">
            <span onClick={() => toggleMyCollection(false)}>Marketplace</span>
            {myCollection && <span> {`>`} My Collection</span>}
          </span>

          <button
            className="my-collection-btn"
            disabled={!address}
            onClick={() => toggleMyCollection()}
          >
            {!myCollection ? "My Collection" : "All"}
          </button>
        </div>

        <div className="ex-subheader">
          {renderSearchInput()}
          <div className="subheader-right">
            {renderSortOptions()}
            <div
              className="grid-icon-wrapper"
              onClick={() => setGridView(GRID_OPTIONS.SMALL)}
            >
              <img src={SmallGridIcon} className="grid-icon" alt="small grid" />
            </div>
            <div
              className="grid-icon-wrapper"
              onClick={() => setGridView(GRID_OPTIONS.LARGE)}
            >
              <img src={LargeGridIcon} className="grid-icon" alt="large grid" />
            </div>
          </div>
        </div>

        <div className="ex-content">
          {!myCollection && (
            <SideFilter
              updateSearchString={updateFilterString}
              setSelectedCollection={setSelectedCollection}
              show={showFilterSider}
              setPayload={setPayload}
            />
          )}
          <div className="ex-list-container">
            <div className="nft-list">
              {myCollection ? (
                <UserCollection gridView={gridView} address={address} />
              ) : (
                nftList.map((nft, index) => (
                  <div
                    key={index}
                    style={{
                      flex: GRID_OPTIONS.SMALL === gridView ? "18%" : "23%",
                      maxWidth: calculateMinMaxWidth(),
                      cursor: "pointer",
                    }}
                  >
                    <NftCard
                      cached={true}
                      key={nft.id}
                      data={nft}
                      tokenId={nft.id}
                      baseContract={nft.contract}
                      marketContract={
                        contractsByBase[nft.contract]?.contracts.market
                      }
                    />
                  </div>
                ))
              )}
              {!myCollection && nftList?.length === 0 && (
                <p style={{ color: "#fff", fontSize: 18 }}>No results</p>
              )}
            </div>
            {hasMore && !myCollection && (
              <div className="infinity-explore-scroll" />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Explore;
