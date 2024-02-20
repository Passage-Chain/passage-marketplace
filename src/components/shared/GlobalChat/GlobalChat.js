import { React } from "react";
import { Card, Row, Col } from "antd";
import { useLocation, Redirect } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactSVG } from "react-svg";
import HeaderOfGlobalChat from "./HeaderOfGlobalChat";
import GlobalChatMessages from "./GlobalChatMessages";
import send from "../../../assets/images/send_btn.svg";
import accountHttpService from "../../../services/account";

export default function GlobalChat({ backToMessages, onExitChat }) {
  const account = useSelector((state) => state.account);
  const userToken = account.token;
  const [text, setText] = useState("");
  const [Messages, setMessages] = useState([]);

  console.log(account.chatLink);
  var socket = new WebSocket(account.chatLink);

  function ChangeText(e) {
    setText(e.target.value);
  }
  function sendMessage() {
    setMessages(
      Messages.concat({
        text: text,
        usernameMe: "userMe",
        usernameFrom: "userMe",
      })
    );

    const outcomingMessage = {
      action: "new-message",
      text: text,
    };
    console.log(outcomingMessage);
    socket.send(outcomingMessage);
  }

  function ClickSend() {
    if (text === "") {
      return;
    }
    console.log(socket.readyState);
    if (socket.readyState === WebSocket.OPEN) {
      sendMessage();
      console.log(1);
    } else {
      setTimeout(sendMessage, 1000);
    }
    setText("");
  }

  socket.onmessage = function (event) {
    var incomingData = event.data;
    console.log(incomingData);
  };

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
                    <HeaderOfGlobalChat
                      backToMessages={backToMessages}
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
                    <GlobalChatMessages testMessages={Messages} />
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
