import { Link } from "react-router-dom";
import "../../styles/style.css";
import "./index.scss";

import RightArrowPointer from "../../assets/images/arrow_left.svg";
import UserDetails from "../../components/custom/UserDetails";

export default function LogIn() {
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
                    <img
                      src={RightArrowPointer}
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
              <div style={{ marginTop: "8px", marginRight: "10px" }}>
                <UserDetails />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
