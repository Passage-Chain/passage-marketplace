import { React } from "react";
import { Row, Col, Table } from "antd";
import CircleButton from "../CircleButton/CircleButton";
import MenuButton from "../MenuButton/MenuButton";
import teleport from "../../../assets/images/ufo.svg";
import Report from "./Report/Report";
import message from "../../../assets/images/message.svg";
import { useState, useEffect } from "react";
import accountHttpService from "../../../services/account";
import removeFriend from "../../../assets/images/removeFriend.svg";
import addFriendImg from "../../../assets/images/Group 316.svg";
import FriendsWithoutBackground from "../../../assets/images/FriendsWithoutBackround.svg";
import { useDispatch, useSelector } from "react-redux";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import MobileReport from "./Report/mobile/MobileReport";
import report from "../../../assets/images/report.svg";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";

import {
  Switch,
  Route,
  useHistory,
  useRouteMatch,
  Link,
} from "react-router-dom";
import { setIsReportOpen } from "../../../redux/reportSlice";
import { setIsSearch } from "../../../redux/searchSlice";
import Search from "antd/lib/input/Search";

import ReportUser from "./ReportUser";
import GameInstance from "../../../services/gameInstance";
import Toast from '../../custom/CustomToast';

export default function FriendsTable(props) {
  const findEmpty = "Find friends!";
  const userNotFind = "The user was not found";
  const [isDesktop, setIsDesktop] = useState(false);
  const screens = useBreakpoint();

  useEffect(() => {
    console.debug(screens);

    if (!screens.md) {
      setIsDesktop(false);
    } else {
      setIsDesktop(true);
    }
    if (isMobile) {
      setIsDesktop(false);
    }
  }, [screens]);

  const locale = {
    color: "#FFFFFF",
    fontFamily: "Niveau Grotesk Bold",
    fontSize: "19px",
    marginTop: "10px",
  };
  const search = useSelector((state) => state.search);
  const isSearch = search.isSearch;
  const dispatch = useDispatch();
  const [searchMatches, setSearchMatches] = useState(search.searchItem);
  const [loaderState, setLoaderState] = useState(true);

  useEffect(() => {
    setSearchMatches(search.searchItem);
  }, [search.searchItem]);

  useEffect(() => {
    setSearchMatches(search.searchItem);
  }, [search.searchItem]);

  const [friendsList, setFriendsList] = useState([]);
  const account = useSelector((state) => state.account);
  const reportRedux = useSelector((state) => state.report);
  const history = useHistory();
  const [whoReported, setWhoReported] = useState("");
  const [reportedUserName, setReportedUserName] = useState("");

  useEffect(() => {
    setFriendsList([]);
    getFriendsList();
    dispatch(setIsReportOpen(false));
    dispatch(setIsSearch(false));
  }, []);

  function getFriendsList() {
    accountHttpService
      .getFriendsList(account.token)
      .then((response) => {
        const list = response;

        setFriendsList(list.data[0].friendsList);
        setLoaderState(true);
        setTimeout(setLoader, 300);
      })
      .catch((error) => {
        Toast.error('error', error.response.data.message);
        
      });
  }

  function setLoader() {
    setLoaderState(false);
  }

  function requestFriendship(record) {
    accountHttpService
      .requestFriendship(account.token, record._id)
      .then((response) => {
        const data = response;
        console.log(data);
        getFriendsList();
      })
      .catch((error) => {
        Toast.error('error', error.response.data.message);
        
      });
  }

  function changeReport(record) {
    setWhoReported(record?.userId?._id);
    setReportedUserName(
      record.userId.firstName ? record.userId.firstName : record?.userId?.email
    );
    dispatch(setIsReportOpen(true));
  }

  function deleteFriend(record) {
    const id = record._id;
    accountHttpService
      .deleteFriend(account.token, id)
      .then((response) => {
        const data = response;
        console.log(data);
        getFriendsList();
      })
      .catch((error) => {
        Toast.error('error', error.response.data.message);
        
      });
    history.push("/app/index/friends");
  }

  const setReportUserModal = (isVisible) => {
    dispatch(setIsReportOpen(isVisible))
  }

  /* function addFriend(record) {
    accountHttpService
      .addFriend(account.token, record._id)
      .then((res) => {
        const data = res;
        console.log(data);    

        accountHttpService
          .getFriendsList(account.token)
          .then((res) => {
            const list = res;
            console.log(list);
            setFriendsList(list.data[0].friendsList);
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  } 

  function rejectionfriendship(record) {
    accountHttpService
      .rejectionfriendship(account.token, record._id)
      .then((response) => {
        const data = response;
        console.log(data);
        accountHttpService
          .getFriendsList(account.token)
          .then((res) => {
            const list = res;
            console.log(list);
            setFriendsList(list.data[0].friendsList);
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
    history.push("/app/index/friends");
  } */

  function teleportUE4To(user) {
    console.debug(user);

    const game = GameInstance.getInstance();
    game.teleport(user.userId._id);
  }

  const columnsFriends = [
    {
      title: "Username",
      dataIndex: "userId.email",
      width: "25%",
      key: "name",
      render: (text, record, index) => {
        return (
          <Row style={{ width: "100%" }}>
            <Col>
              <Row>
                <span
                  style={{ fontFamily: "Niveau Grotesk Bold", fontSize: 20 }}
                >
                  {record.hasOwnProperty("userId")
                    ? record.userId.firstName
                      ? record.userId.firstName
                      : record?.userId?.email
                    : "fdsjkfsjh"}
                </span>
              </Row>
              {/* <Row>
                <span style={{ fontFamily: "Montserrat", fontSize: 10 }}>
                  {record?.userId?.accepted ? null : "not accepted"}
                  {console.log(record)}
                </span>
              </Row> */}
            </Col>
          </Row>
        );
      },
    },
    /*{
      title: "Message",
      dataIndex: "age",
      width: "15%",
      align: "center",
      key: "age",
      render: (text, record, index) => {
        return (
          <Link
            to={{
              pathname: "/app/index/chat",
              state: { record: record?.userId?.email },
            }}
            style={{ textDecoration: "none", color: "white" }}
          >
            <Row>
              <Col>
                <MenuButton img={message} i/>
              </Col>
            </Row>
          </Link>
        );
      },
    },*/
    {
      title: "Teleport to",
      dataIndex: "address",
      width: "7%",
      //align: "center",
      key: "address",
      render: (text, record, index) => {
        return (
          <Row>
            <Col onClick={() => teleportUE4To(record)}>
              <MenuButton img={teleport} />
            </Col>
          </Row>
        );
      },
    },
    {
      title: "Report",
      dataIndex: "address",
      width: "5%",
      //align: "center",
      key: "address",
      render: (text, record, index) => {
        return (
          <Row>
            <Col>
              <div onClick={() => changeReport(record)}>
                <MenuButton img={report} />
              </div>
            </Col>
          </Row>
        );
      },
    },
    /*{
      title: "Block",
      dataIndex: "address",
      width: "15%",
      align: "center",
      key: "address",
      render: (text, record, index) => {
        return (
          <Row>
            <Col>
              <MenuButton img={message} />
            </Col>
          </Row>
        );
      },
    },*/
    {
      title: "Remove",
      dataIndex: "address",
      width: "4%",
      //align: "center",
      key: "address",
      render: (text, record, index) => {
        return (
          <Row>
            <Col onClick={() => deleteFriend(record)}>
              <MenuButton img={removeFriend} />
            </Col>
          </Row>
        );
      },
    },
  ];

  const columsSearch = [
    {
      title: "Username",
      dataIndex: "userId.email",
      width: "25%",
      key: "name",
      render: (text, record, index) => {
        return (
          <Row style={{ width: "100%" }}>
            <Col>
              <Row>
                <span
                  style={{ fontFamily: "Niveau Grotesk Bold", fontSize: 20 }}
                >
                  {record.firstName ? record.firstName : record.email}
                </span>
              </Row>
            </Col>
          </Row>
        );
      },
    },
    /* {
      title: "Message",
      dataIndex: "age",
      width: "15%",
      align: "center",
      key: "age",
      render: (text, record, index) => {
        return (
          <Link
            to={{
              pathname: "/app/index/chat",
              state: {
                id: record._id,
                nick: record.firstName ? record.firstName : record.email,
                fromMessages: false,
              },
            }}
            style={{ textDecoration: "none", color: "white" }}
          >
            <Row justify={"center"}>
              <Col span={16}>
                <CircleButton img={message} imgDisabled={message} />
              </Col>
            </Row>
          </Link>
        );
      }
    }, */
    {
      title: "Add to Friends",
      dataIndex: "address",
      width: "5%",
      //align: "center",
      key: "address",
      render: (text, record, index) => {
        return (
          <Row>
            <Col
              span={16}
              style={{ marginLeft: 20 }}
              onClick={() => requestFriendship(record)}
            >
              <MenuButton img={addFriendImg} />
            </Col>
          </Row>
        );
      },
    },
  ];
  return (
    <Row>
      <Col span={24}>
        {!isSearch ? (
          <Table
            pagination={false}
            className={"friendsTable"}
            rowClassName={""}
            style={{ width: "100%", height: isDesktop ? "600px" : "79vh" }}
            dataSource={friendsList}
            columns={columnsFriends}
            loading={loaderState}
            locale={{
              emptyText: (
                <Row justify="center">
                  <Col span={24}>
                    <div>
                      <img src={FriendsWithoutBackground}></img>
                    </div>
                  </Col>
                  <Col span={24}>
                    <span style={locale}>You don't have any friends yet</span>
                  </Col>
                  <Col span={24}>
                    <span style={locale}>Try to find and add a friend!</span>
                  </Col>
                </Row>
              ),
            }}
          />
        ) : (
          <Table
            pagination={false}
            className={"friendsTable"}
            rowClassName={""}
            style={{ width: "100%", height: isDesktop ? "78vh" : "600px" }}
            dataSource={searchMatches}
            columns={columsSearch}
            locale={{
              emptyText: (
                <Row justify={"center"}>
                  <Col span={24}>
                    <Row>
                      <Col span={24}>
                        <div>
                          <img src={FriendsWithoutBackground}></img>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      {search.searchText === "" ? (
                        <Col span={24}>
                          <span style={locale}>{findEmpty}</span>
                        </Col>
                      ) : search.isUserFind ? (
                        <Col span={24}>
                          <span style={locale}></span>
                        </Col>
                      ) : (
                        <Col span={24}>
                          <span style={locale}>{userNotFind}</span>
                        </Col>
                      )}
                    </Row>
                  </Col>
                </Row>
              ),
            }}
          />
        )}
      </Col>
      <ReportUser 
        whoReported={whoReported}
        reportedUserName={reportedUserName}
        isModalVisible={reportRedux.isReportOpen}
        setIsModalVisible={setReportUserModal}
      />
    </Row>
  );
}
