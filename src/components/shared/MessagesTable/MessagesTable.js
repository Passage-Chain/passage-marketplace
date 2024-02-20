import { React } from "react";
import { Row, Col, Table } from "antd";
import teleport from "../../../assets/images/ufo.svg";
import message from "../../../assets/images/message.svg";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import accountHttpService from "../../../services/account";
import { useDispatch, useSelector } from "react-redux";
import MenuButton from "../MenuButton/MenuButton";
import Toast from '../../custom/CustomToast';
import { handleApiError } from "../../utils/AuthVerify/AuthVerify";
export default function MessagesTable({ isMobile }) {
  const history = useHistory();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const account = useSelector((state) => state.account);
  const [friendsList, setFriendsList] = useState([]);
  const [loaderState, setLoaderState] = useState(true);

  useEffect(() => {
    accountHttpService
      .getFriendsList(account.token)
      .then((response) => {
        const list = response;
        console.log(list);
        setFriendsList(list.data[0].friendsList);
        setLoaderState(true);
        setTimeout(setLoader, 300);
      })
      .catch((error) => {
        handleApiError(error);
        
      });
  }, []);

  function setLoader() {
    setLoaderState(false);
  }

  const columns = [
    {
      title: "Username",
      dataIndex: "name",
      width: "30%",
      key: "name",
      render: (text, record, index) => {
        return (
          <Row
            onClick={() => {
              history.push("/app/index/chat", {
                fromMessages: true,
                id: record.userId._id,
                nick: record.userId.firstName
                  ? record.userId.firstName
                  : record.userId.email,
              });
            }}
            style={{ width: "100%" }}
          >
            <Col>
              <Row>
                <Col
                  style={{
                    textOverflow: "ellipsis",
                    maxWidth: "100%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Niveau Grotesk Bold",
                      fontSize: 20,
                    }}
                  >
                    {record.hasOwnProperty("userId")
                      ? record.userId.firstName
                        ? record.userId.firstName
                        : record?.userId?.email
                      : "fdsjkfsjh"}
                  </span>
                </Col>
              </Row>
            </Col>
          </Row>
        );
      },
    },

    {
      title: "Block",
      dataIndex: "address",
      width: "30%",

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
    },
    {
      title: "Teleport to",
      dataIndex: "address",
      width: "25%",
      //align: "center",
      key: "address",
      render: (text, record, index) => {
        return (
          <Row>
            <Col>
              <MenuButton img={teleport} />
            </Col>
          </Row>
        );
      },
    },
  ];

  return (
    <Table
      pagination={false}
      className={"friendsTable"}
      rowClassName={""}
      style={{ width: "100%", height: isMobile ? "77vh" : "600px" }}
      dataSource={friendsList}
      columns={columns}
      onRow={(data, index) => {
        return {
         /* onClick: (event) => {
            if (event.target.className === "ant-row") {
              history.push("/app/index/chat", {
                nick: data.userId.firstName
                  ? data.userId.firstName
                  : data.userId.email,
              });
            }
          }, */
        };
      }}
      loading={loaderState}
    />
  );
}
