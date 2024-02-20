import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, useHistory } from "react-router";
import { clean } from "../../../redux/accountSlice";
import WorldLayout from "../../layout/World";
import { Modal } from "antd";
import LogInForm from "src/views/Log In/LoginForm";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const isUserLoggedIn = (tokenData, logout) => {
  if (tokenData) {
    const decodedJwt = parseJwt(tokenData);
    if (decodedJwt) {
      if (decodedJwt?.exp * 1000 < Date.now()) {
        logout();
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export default function GuardedRoute({
  component: Component,
  auth,
  redirect,
  path,
  authRequired = true,
  ...rest
}) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const history = useHistory(); // Add this line

  const logout = () => {
    dispatch(clean());
    localStorage.setItem("token", null);
  };
  const hideModal = () => {
    setOpen(false);
  };

  const onCancel = () => {
    setOpen(false);
    history.push("/login"); // Redirect to login page
  };

  const token = useSelector((state) => state.account.token);
  const isLoggedIn = isUserLoggedIn(token, logout);
  return (
    <Route
      exact={true}
      {...rest}
      render={(props) => {
        if (isLoggedIn || !authRequired) {
          return (
            <WorldLayout>
              <Component {...props} {...rest} />
            </WorldLayout>
          );
        } else {
          if (!open) setOpen(true);
          return (
            <Modal
              className="login_modal"
              visible={open}
              onOk={hideModal}
              onCancel={onCancel}
            >
              <LogInForm />
            </Modal>
          );
        }
      }}
    />
  );
}
