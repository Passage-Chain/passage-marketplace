import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Input, Popover } from "antd";
import { ReactComponent as SearchIcon } from "../../assets/images-v2/search.svg";
import { ReactComponent as SearchTickIcon } from "../../assets/images/search_tick_icon.svg";
import { ReactComponent as DownArrowIcon } from "../../assets/images/down_arrow_chevron.svg";
import "./index.scss";
import useDebounce from "../../hooks/useDebounce";
import accountHttpService from "../../services/account";
import socialService from "../../services/social";
import { ReactComponent as UserImg } from "../../assets/images/icon-user.svg";
import { CustomButton } from ".";
import Toast from "../custom/CustomToast";
import { FEED_USER_TYPES } from "src/utils/globalConstant";
import { useSelector } from "react-redux";

const styles = {
  minSearchWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 52,
    height: 52,
    border: "1px solid #C3CFD5",
    borderRadius: 100,
    cursor: "pointer",
  },
  searchIcon: {
    width: 12.5,
    height: 12.5,
  },
};

const SEARCH_TYPES = {
  global: "Global",
  world: "World",
  people: "People",
};

const DropList = ({ selectedType, setSelectedType }) => {
  return (
    <div className="search_dropdown_list">
      {Object.keys(SEARCH_TYPES).map((type, index) => (
        <div
          key={index}
          className="search_dropdown_item"
          onClick={() => setSelectedType(type)}
        >
          {SEARCH_TYPES[type]} {selectedType === type && <SearchTickIcon />}
        </div>
      ))}
    </div>
  );
};

const GlobalSearchInput = () => {
  const [expand, setExpand] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [searchType, setSearchType] = useState("global");
  const [peopleList, setPeopleList] = useState([]);
  const [worldList, setWorldList] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const debouncedSearchText = useDebounce(searchString, 1000);
  const account = useSelector((state) => state.account);

  const history = useHistory();

  useEffect(() => {
    if (debouncedSearchText) {
      fetchSearchList();
    } else {
      setPeopleList([]);
      setWorldList([]);
    }
  }, [debouncedSearchText, searchType]);

  useEffect(() => {
    if (peopleList.length || worldList.length) {
      setShowResult(true);
    } else {
      setShowResult(false);
    }
  }, [peopleList, worldList]);

  const handleSearchInput = (event) => {
    const str = event.target.value;
    setSearchString(str);
  };

  const fetchSearchList = async () => {
    try {
      const response = await accountHttpService.getGlobalSearch(
        debouncedSearchText,
        searchType
      );
      const filteredData = response.data?.filteredData;
      const { people, world } = filteredData.length ? filteredData[0] : {};
      const peopleList = (people?.data || []).filter(
        (people) => people.id !== account.id
      );
      setPeopleList(peopleList);
      setWorldList(world?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProfileClick = (user) => {
    history.push("/feeds", {
      friend: user,
      usertype: FEED_USER_TYPES.OTHER,
    });
    setShowResult(false);
    setSearchString("");
  };

  const handleSendFriendRequest = async (email) => {
    try {
      const payload = {
        emails: email
          .split(",")
          .map((el) => el.trim())
          .filter((el) => el),
      };
      await socialService.sendFriendRequest(payload);
      Toast.success("Invitation Sent", "");
      fetchSearchList();
    } catch (error) {
      console.log(error);
      Toast.error("Unsuccessful", "Something went wrong, please try again!");
    }
  };

  return (
    <div className="custom-search-container">
      {!expand ? (
        <div style={styles.minSearchWrapper} onClick={() => setExpand(true)}>
          <SearchIcon style={styles.searchIcon} />
        </div>
      ) : (
        <>
          <Input
            className="global-search-input"
            placeholder="Search..."
            onChange={handleSearchInput}
            value={searchString}
            maxLength={100}
            suffix={
              <>
                <span className="mr_15 color_white">In</span>{" "}
                <Popover
                  placement="bottom"
                  content={
                    <DropList
                      selectedType={searchType}
                      setSelectedType={setSearchType}
                    />
                  }
                  trigger="click"
                >
                  <button className="color_white selected_global_value">
                    {SEARCH_TYPES[searchType]} <DownArrowIcon />{" "}
                  </button>
                </Popover>
              </>
            }
            prefix={
              <SearchIcon
                className="cursor-pointer"
                onClick={() => setExpand(false)}
              />
            }
          />

          {showResult && (
            <div className="global_search_result_container">
              {worldList.length > 0 && (
                <div className="global_search_row">
                  <h3 className="global_search_heading">World</h3>
                  {worldList.map((world, idx) => (
                    <p className="global_search_item" key={idx}>
                      <div>
                        <img
                          className="global_search_item_img"
                          src={world.worldIcon}
                          height={50}
                          width={50}
                          alt="world_icon"
                        />
                        <span className="global_search_item_name">
                          {world.worldName}
                        </span>
                      </div>
                      <CustomButton
                        btnStyle={{ height: 20, padding: "13px 11px" }}
                        onClick={() => {}}
                        label="JOIN"
                        disabled={true}
                      />
                    </p>
                  ))}
                </div>
              )}

              {peopleList.length > 0 && (
                <div className="global_search_row">
                  <h3 className="global_search_heading">People</h3>
                  {peopleList.map((people, idx) => (
                    <p className="global_search_item" key={idx}>
                      <div>
                        {people.profileImage ? (
                          <img
                            className="global_search_item_img"
                            src={people.profileImage}
                            height={50}
                            width={50}
                            alt="world_icon"
                            style={{ borderRadius: "50%" }}
                          />
                        ) : (
                          <UserImg
                            className="global_search_item_img"
                            height={46}
                            width={46}
                          />
                        )}
                        <span
                          style={{ textTransform: "none" }}
                          className="global_search_item_name"
                        >
                          {people.nickname}
                        </span>
                      </div>
                      <div className="global-search-btn-wrapper">
                        <CustomButton
                          btnStyle={{ height: 20, padding: "13px 11px" }}
                          onClick={() => handleProfileClick(people)}
                          label="PROFILE"
                        />
                        {!people.isFriend && !people.isRequestSent && (
                          <CustomButton
                            btnStyle={{ height: 20, padding: "13px 11px" }}
                            onClick={() =>
                              handleSendFriendRequest(people.email)
                            }
                            label="SEND FRIEND REQUEST"
                          />
                        )}
                        {people.isRequestSent && (
                          <span className="request-sent-txt">
                            Request sent!
                          </span>
                        )}
                      </div>
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GlobalSearchInput;
