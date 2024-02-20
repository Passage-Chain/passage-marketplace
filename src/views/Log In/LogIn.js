import { Link, Redirect } from "react-router-dom";
import "../../styles/style.css";
import "./index.scss";

import { ReactComponent as RightArrowPointer } from "../../assets/images/arrow_left.svg";
import { useSelector } from "react-redux";

export default function LogIn() {
  const token = useSelector((state) => state.account.token);

  if (token) {
    return <Redirect to="/discover" />;
  }

  return (
    <>
      <div className="world-container">
        <div className="world-detail-container home-container">
          <div style={{ display: "flex" }}>
            <span>
              <Link to="/marketplace">
                <button className="marketplace-button">
                  <span className="marketplace-text">
                    Go to Marketplace{" "}
                    <RightArrowPointer
                      style={{
                        transform: "rotate(180deg)",
                        padding: "0 10px 0 0",
                      }}
                    />
                  </span>
                </button>
              </Link>
            </span>
            <div className="world-cta-wrapper new_logIn_button_container">
              <button className="auth-button new-logIn-button">
                <span>CONNECT WALLET</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
