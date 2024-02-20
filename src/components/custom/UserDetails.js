import { useState, useRef } from "react";
import "./index.scss";
import { Modal } from "antd";

import LogInForm from "src/views/Log In/LoginForm";

const UserDetails = () => {
  const [open, setOpen] = useState(false);
  const address = localStorage.getItem("active_address");

  const userDetailRef = useRef();

  const hideModal = () => {
    setOpen(false);
  };

  const showModal = () => {
    setOpen(true);
  };

  return (
    <div className={"user-details-container"} ref={userDetailRef}>
      {address ? (
        <button
          style={{
            background: "none",
            border: "none",
            fontFamily: "Montserrat",
            fontWeight: "bold",
            color: "white",
            fontSize: "18px",
            textAlign: "center",
          }}
          onClick={showModal}
        >
          {address.slice(0, 14)}...
        </button>
      ) : (
        <button
          style={{
            background: "none",
            border: "none",
            fontFamily: "Montserrat",
            fontWeight: "bold",
            color: "white",
            fontSize: "18px",
            textAlign: "center",
          }}
          onClick={showModal}
        >
          Log In/Connect Wallet
        </button>
      )}
      <Modal
        className="login_modal"
        visible={open}
        onOk={hideModal}
        onCancel={hideModal}
      >
        <LogInForm alpha={true} closeModal={hideModal} />
      </Modal>
    </div>
  );
};

export default UserDetails;
