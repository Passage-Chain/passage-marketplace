import { React } from "react";
import { Card, Row, Col } from "antd";
import MobileHeaderOfChat from "./Mobile/MobileHeaderOfChat";
import { useLocation, Redirect } from "react-router-dom";
import ChatMessages from "./ChatMessages";
import { useState, useEffect } from "react";
import { ReactSVG } from "react-svg";
import send from "../../../assets/images/send_btn.svg";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
export default function MobileChat(props) {
  const screens = useBreakpoint();
  const onExitChat = props.onExitChat;
  const location = useLocation();

  const interlocutorId = location.state.id;
  const userNickName = location.state.nick;
  const fromMessages = location.state.fromMessages;

  const [text, setText] = useState("");
  const [testMessages, setTestMessages] = useState([
    {
      text: "This is a test message!",
      usernameFrom: "userNotME",
      usernameMe: "userMe",
    },
    {
      text: "This is a test message!",
      usernameFrom: "userMe",
      usernameMe: "userMe",
    },
  ]);
  const notXs = {
    marginTop: "5px",
  };
  function ChangeText(e) {
    setText(e.target.value);
  }
  function ClickSend() {
    console.debug("clicked send");
    if (text === "") {
      return;
    }

    setTestMessages(
      testMessages.concat({
        text: text,
        usernameMe: "userMe",
        usernameFrom: "userMe",
      })
    );

    setText("");
  }
  const background = {
    background: "#404040",
    width: "100%",
    height: "100%",
    pointerEvents: "auto",
  };
  const Panel = {
    background: "#282828",
    width: "98%",
    height: "96vh",
    marginLeft: "1%",
    marginTop: "1%",
    borderRadius: "15px",
    overflowY: "hide",
  };
  const input = {
    borderRadius: "20px ",
    background: "#040206",
    color: "#FFFFFF",
    fontSize: "16px",
    fontFamily: "Montserrat",
    width: "90%",
    height: "80%",
    border: "none",
    paddingLeft: "10px",
    paddingTop: "10px",
    paddingBottom: "13px",
    marginBottom: 10,
  };

  return (
    <Row style={background}>
      <Col span={24}>
        <Row>
          <Col span={24}>
            <Row style={Panel} id="mobile-fix-messages-panel">
              <Col span={24}>
                <Row>
                  <Col span={24}>
                    <MobileHeaderOfChat
                      userNickName={userNickName}
                      backToMessages={fromMessages}
                      onExitChat={onExitChat}
                    />
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row
                  style={{
                    overflowY: "scroll",
                    height: !screens.xs ? "63vh" : "60vh",
                    background: "#191919",
                  }}
                  id="mobile-fix-chat"
                >
                  <Col span={24}>
                    <ChatMessages testMessages={testMessages} />
                  </Col>
                </Row>
              </Col>
              <Col span={24} className="input-col" style={{ marginTop: "1%" }}>
                <Row>
                  <Col span={24}>
                    <Row>
                      <Col span={24}>
                        <Row justify="center">
                          <Col xs={21} sm={21}>
                            <input
                              className={!screens.xs ? "auth-input" : "xsinput"}
                              value={text}
                              style={!screens.xs ? { width: "100%" } : input}
                              placeholder="Type here..."
                              onChange={(e) => ChangeText(e)}
                              id="chat-input"
                            ></input>
                          </Col>
                          <Col
                            xs={3}
                            sm={2}
                            style={!screens.xs ? notXs : { marginTop: 7 }}
                            className="opacity"
                            onClick={ClickSend}
                          >
                            <ReactSVG src={send}></ReactSVG>
                          </Col>
                        </Row>
                      </Col>
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
