import { React } from "react";
import { Row, Col } from "antd";

import { ReactSVG } from "react-svg";

import CircleButton from "../CircleButton/CircleButton";

import FriendsWithoutBackground from "../../../assets/images/FriendsWithoutBackround.svg";
import close from "../../../assets/images/close_btn (Hover State).svg";
import Facebook from "../../../assets/images/facebook.svg";
import findBtn from "../../../assets/images/Group -9.svg";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsSearch,
  setSearchItem,
  setSearchText,
  setIsUserFind,
} from "../../../redux/searchSlice";
import accountHttpService from "../../../services/account";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import Toast from '../../custom/CustomToast';
import { useHistory } from 'react-router-dom';

export default function FriendNavigationPanel({ onExitFriendsClick }) {
  const screens = useBreakpoint();

  const search = useSelector((state) => state.search);
  const account = useSelector((state) => state.account);
  const isSearch = search.isSearch;
  const dispatch = useDispatch();
  const [isFindOpen, setIsFindOpen] = useState(search.isFindOpen);
  const [searchValue, setSearchValue] = useState(search.searchText);
  const history = useHistory();

  useEffect(() => {
    dispatch(setIsSearch(false));
  }, []);

  function inputChange(e) {
    const inputText = e.target.value;
    setSearchValue(inputText);
    clearSearch();
  }

  function clearSearch() {
    dispatch(setSearchItem([]));
    dispatch(setSearchText(""));
  }

  useEffect(() => {
    if (searchValue === "") {
      return;
    }
    dispatch(setSearchText(searchValue));
    const delaySearchFunction = setTimeout(() => {
      searchByParams();
    }, 500);

    return () => clearTimeout(delaySearchFunction);
  }, [searchValue]);

  function searchByParams() {
    let email = searchValue;
    let userName = searchValue;
    accountHttpService
      .searchUser(account.token, email, userName)
      .then((res) => {
        const data = res;
        dispatch(setSearchItem(data.data));
        data.data.length === 0
          ? dispatch(setIsUserFind(false))
          : dispatch(setIsUserFind(true));
          
        console.log(data);
      })
      .catch((error) => {
        Toast.error('error', error.response.data.message);
        
      });
      
  }

  function swapFind() {
    if (isFindOpen === true) {
      setIsFindOpen(false);
      dispatch(setIsSearch(false));
    } else {
      setIsFindOpen(true);
      dispatch(setIsSearch(true));
    }
    clearSearch();
    setSearchValue("");
  }

  const input = {
    borderRadius: "20px",
    background: "#040206",
    color: "#FFFFFF",
    fontSize: "16px",
    fontFamily: "Montserrat",
    paddingLeft: "10px",
    width: "95%",
    height: "85%",
    marginTop: 8,
  };

  return (
    <div>
      {!isFindOpen ? (
        <Row
          style={{
            paddingRight: 24,
            paddingBottom: 12,
            paddingTop: 12,
            paddingLeft: 24,
          }}
          justify={"space-between"}
        >
          <Col style={{ display: "flex" }}>
            <Row style={{ alignContent: "center" }}>
              <Col>
                <ReactSVG src={FriendsWithoutBackground}></ReactSVG>
              </Col>
              <Col style={{ marginLeft: 16 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    letterSpacing: 0,
                    fontSize: 19,
                    fontFamily: "Niveau Grotesk Bold",
                  }}
                >
                  FRIENDS
                </span>
              </Col>
            </Row>
          </Col>
          <Col>
            <Row>
              {/* <Col>
                <Row style={{ alignContent: "center" }}>
                  <span
                    style={{
                      marginRight: 6,
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    Connect to facebook
                  </span>
                  <div className="backgroundForSVG">
                    <CircleButton
                      img={Facebook}
                      imgDisabled={Facebook}
                    ></CircleButton>
                  </div>
                </Row>
              </Col> */}
              <Col style={{ marginLeft: 16 }}>
                <Row style={{ alignContent: "center" }}>
                  <span
                    style={{
                      marginRight: 6,
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    Search user
                  </span>
                  <div onClick={swapFind}>
                    <CircleButton
                      img={findBtn}
                      imgDisabled={findBtn}
                    ></CircleButton>
                  </div>
                </Row>
              </Col>
              <Col style={{ marginLeft: 16 }} onClick={onExitFriendsClick}>
                <div className="backgroundForSVG">
                  <CircleButton img={close} imgDisabled={close}></CircleButton>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      ) : (
        <Row
          style={{
            paddingRight: 10,
            paddingBottom: 12,
            paddingTop: 12,
            paddingLeft: 12,
          }}
        >
          <Col span={24}>
            <Row>
              <Col span={24}>
                <Row>
                  <Col span={2} style={{ marginTop: 10 }}>
                    <div>
                      <ReactSVG src={FriendsWithoutBackground}></ReactSVG>
                    </div>
                  </Col>
                  <Col
                    span={screens.xs ? 19 : screens.sm ? 20 : 19}
                    style={{ paddingBottom: 5, marginLeft: 10 }}
                  >
                    <input
                      style={input}
                      value={searchValue}
                      onChange={(e) => inputChange(e)}
                    ></input>
                  </Col>

                  <Col span={1} onClick={swapFind} style={{ marginTop: 5 }}>
                    <div className="backgroundForSVG">
                      <ReactSVG src={close}></ReactSVG>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </div>
  );
}
