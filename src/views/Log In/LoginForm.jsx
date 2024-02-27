import { Row, Col, Tooltip } from "antd";
import { ReactSVG } from "react-svg";
import "../../styles/style.css";
import KeplrIcon from "../../assets/images/icon-kepler.png";

import PassageLogo from "../../assets/images/Passage_VerticalLogoWhite 1.svg";

import loginBg from "../../assets/images/signin-bg.png";

import Toast from "../../components/custom/CustomToast";
import Wallet from "../../services/wallet";

export default function LogInForm({ alpha, handleRedirection, closeModal }) {
  // check if user is logged in or connected with wallet
  const connectedAddressOnly = localStorage.getItem("active_address");

  const connectWallet = async (walletType) => {
    try {
      const walletAddress = await Wallet.connectWallet(walletType);

      if (!walletAddress) {
        throw new Error("Wallet address is undefined");
      }

      localStorage.setItem("active_address", walletAddress);
      Toast.success("Connected", `Wallet address ${walletAddress} connected`);
      closeModal();
    } catch (err) {
      Toast.error("Error", "Issue connecting wallet");
      console.log("err", err);
    }
  };
  const disconnectWallet = async (walletType) => {
    localStorage.removeItem("active_address");
    Toast.success("Disconnected", `Wallet disconnected`);
    closeModal();
  };

  // temporary solution, better to implement a switch statement here later imo
  return connectedAddressOnly && alpha ? (
    <>
      <Row>
        <Col
          className=""
          xs={18}
          sm={11}
          md={8}
          lg={8}
          xl={5}
          style={{
            background: `url(${loginBg}) no-repeat`,
            textAlign: "center",
            borderRadius: "24px",
            pointerEvents: "auto",
            maxWidth: "390px",
            minWidth: "350px",
          }}
        >
          <Row justify="center">
            <Col span={24} style={{ textAlign: "center" }}>
              <ReactSVG src={PassageLogo}></ReactSVG>
            </Col>
            <Col
              span={24}
              className="login_text_heading"
              style={{ padding: "16px" }}
            >
              <button onClick={disconnectWallet} className="auth-button">
                DISCONNECT WALLET
              </button>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  ) : (
    <>
      <Row>
        <Col
          className=""
          xs={18}
          sm={11}
          md={8}
          lg={8}
          xl={5}
          style={{
            background: `url(${loginBg}) no-repeat`,
            textAlign: "center",
            borderRadius: "24px",
            pointerEvents: "auto",
            maxWidth: "390px",
            minWidth: "350px",
          }}
        >
          <Row justify="center">
            <Col span={24} style={{ textAlign: "center" }}>
              <ReactSVG src={PassageLogo}></ReactSVG>
            </Col>

            <Col
              span={20}
              className="remember-row"
              style={{ marginBottom: "16px", fontFamily: "Montserrat" }}
            >
              <Row justify="space-between">
                <Col span={24} style={{ marginTop: "15px" }}>
                  <Col
                    span={24}
                    className="login_text_heading"
                    style={{ margin: "0px" }}
                  >
                    <div>
                      <Col span={24} className="login_text_heading">
                        Connect Wallet
                      </Col>
                      <div
                        style={{
                          gap: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Tooltip placement="bottom" title={"Keplr"}>
                          <img
                            src={KeplrIcon}
                            onClick={() => connectWallet("keplr")}
                            alt="keplr"
                          />
                        </Tooltip>
                      </div>
                    </div>
                  </Col>
                </Col>
                <Col
                  span={24}
                  style={{
                    textAlign: "center",
                    color: "grey",
                    fontFamily: "Montserrat",
                    fontSize: "14px",
                    marginBottom: "15px",
                    marginTop: "15px",
                  }}
                ></Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
