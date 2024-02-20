import { React } from "react";
import { Card, Row, Col } from "antd";
import HeaderOfChat from "./HeaderOfChat";
import { useLocation, Redirect } from "react-router-dom";
import ChatMessages from "./ChatMessages";
import { useState, useEffect } from "react";
import { ReactSVG } from "react-svg";
import send from "../../../assets/images/send_btn.svg";
import { useDispatch, useSelector } from "react-redux";

export default function DesktopChat(props) {
  const onExitChat = props.onExitChat;
  const location = useLocation();
  const interlocutorId = location.state.id;
  const userNickName = location.state.nick;
  const fromMessages = location.state.fromMessages;
  const account = useSelector((state) => state.account);

  const [text, setText] = useState("");
  const [Messages, setMessages] = useState([]);

  const chatLink = account.chatLink;
  var socket;

  useEffect(() => {
    if (!socket) {
      socket = new WebSocket(chatLink);
      console.log("create webSocket");

      socket.onmessage = function (event) {
        var incomingData = event.data;
        console.info(incomingData);
      };
    }
  }, []);

  function ChangeText(e) {
    setText(e.target.value);
  }

  function sendMessage() {
    setMessages(
      Messages.concat({
        text: text,
        usernameMe: `${account.neonName}`,
        usernameFrom: `${account.neonName}`,
      })
    );

    const outcomingMessage = {
      action: "new-message",
      to: `${interlocutorId}`,
      text: text,
    };

    var MessagetoSend = JSON.stringify(outcomingMessage);
    console.log(MessagetoSend);
    socket.send(MessagetoSend);
  }

  function ClickSend() {
    console.info(socket)
    if (text === "") {
      return;
    }
    if (!socket) {
      return;
    }

    let id = location.state.id;

    /*chatService
      .sendMessage(id, "Hello world")
      .then((result) => {
        console.debug(result);
      })
      .catch((error) => {
        console.debug(error);
      });

    setTestMessages(
      testMessages.concat({
        text: text,
        usernameMe: "userMe",
        usernameFrom: "userMe",
      })
    );*/

    setText("");
  }

  return (
    <Row style={{ pointerEvents: "auto" }}>
      <div
        style={{
          background: "gray",
          opacity: "0.5",
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
      ></div>
      <Col span={24}>
        <Row justify={"end"} style={{ height: "30vh" }}>
          <Col>
            <Row
              style={{
                background: "#282828",
                width: 400,
                borderRadius: "10px",
              }}
            >
              <Col span={24}>
                <Row>
                  <Col span={24}>
                    <HeaderOfChat
                      userNickName={userNickName}
                      backToMessages={fromMessages}
                      onExitChat={onExitChat}
                    />
                  </Col>
                </Row>
                <Row
                  style={{
                    overflowY: "scroll",
                    height: "60vh",
                    background: "#191919",
                  }}
                >
                  <Col span={24}>
                    <ChatMessages testMessages={Messages} />
                  </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                  <Col span={24}>
                    <Row style={{ marginLeft: 10, marginRight: 10 }}>
                      <input
                        style={{ marginRight: 10 }}
                        className="auth-input"
                        value={text}
                        placeholder="Type here..."
                        onChange={(e) => ChangeText(e)}
                      ></input>
                      <div className="opacity">
                        <ReactSVG src={send} onClick={ClickSend}></ReactSVG>
                      </div>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
