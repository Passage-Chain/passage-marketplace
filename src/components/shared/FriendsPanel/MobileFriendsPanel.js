import { React } from "react";
import { Card, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import FriendsTable from "./FriendsTable";
import FriendNavigationPanel from "./FriendNavigationPanel";
import { useState, useEffect } from "react";

export default function MobileFriendsPanel({ onExitFriendsClick }) {
  const report = useSelector((state) => state.report);
  const [isHide, setIsHide] = useState(false);

  useEffect(() => {
    if (report.isReportOpen) {
      setIsHide(true);
      if (report.isReportSubmited) {
        setIsHide(false);
      }
    } else {
      setIsHide(false);
    }
  }, [report]);

  return (
    <Row
      align={"center"}
      justify={"center"}
      style={{
        height: "100%",
        backgroundColor: "gray",
        pointerEvents: "auto",
      }}
    >
      <Col span={24}>
        <Row
          justify={"center"}
          style={{ alignContent: "center", height: "100%" }}
        >
          <Card
            style={{
              width: isHide ? 0 : "97vw",
              boxShadow: "2px",

              border: 0,
              backgroundColor: "#282828",
              borderRadius: 10,
              color: "white",
            }}
            id="mobile-fix-friends"
          >
            {/* Header */}
            <Row>
              <Col span={24}>
                <FriendNavigationPanel
                  onExitFriendsClick={onExitFriendsClick}
                />
                <Row style={{ overflowY: "scroll" }}>
                  <Col span={24}>
                    <FriendsTable />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Row>
      </Col>
    </Row>
  );
}
