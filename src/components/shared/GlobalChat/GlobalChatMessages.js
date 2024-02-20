import { React } from "react";
import { Card, Row, Col } from "antd";
import { useState, useEffect } from "react";

export default function GlobalChatMessages(props) {
  let testMessages = props.testMessages;
  const [Messages, setMessages] = useState(testMessages);
  function renderMessage(message) {
    const { text, usernameFrom, usernameMe } = message;

    const MessageFromME = usernameFrom === usernameMe;

    const className = MessageFromME
      ? "Messages-message currentMember"
      : "Messages-message";

    const classNameMessage = MessageFromME ? "text currentMember" : "text";

    return (
      <li className={className}>
        <div className="Message-content">
          <div className="username">{usernameFrom}</div>
          <div className={classNameMessage}>{text}</div>
        </div>
      </li>
    );
  }

  return (
    <Row style={{ paddingLeft: 10, paddingRight: 20 }}>
      <Col span={24}>
        <ul className="Messages-list">
          {testMessages.map((m) => renderMessage(m))}
        </ul>
      </Col>
    </Row>
  );
}
