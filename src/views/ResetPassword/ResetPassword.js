import { Row, Col } from "antd";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import background from "../../assets/images/reset_bg.png";
import PassageLogo from "../../assets/images/Passage_VerticalLogoWhite 1.svg";
import { ReactSVG } from "react-svg";
import "../../styles/style.css";
import "./index.scss";
import accountHttpService from "../../services/account";
import showPasswordIcon from "../../assets/images/show_password.svg";
import hidePasswordIcon from "../../assets/images/hide_password.svg";
import { useSelector } from "react-redux";
import { REGISTRATION } from "../../components/shared/globalConstant";
import Toast from "../../components/custom/CustomToast";
import { validateEmail } from "../../configs";

export default function ResetPassword() {
  const history = useHistory();
  const [inputIdentifire, setInputIdentifire] = useState("");
  const [responseEmail, setResponseEmail] = useState("");
  const [securityHash, setResponseSecurityHash] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inputError, setInputError] = useState("");
  const [isHidePassword, setShowHidePass] = useState(true);
  const [isConfirmHidePassword, setShowConfirmHidePass] = useState(true);
  const initialScreen = { isIdentifyScreen: true, isResetpasswordScreen: false};
  const [screens, setScreens] = useState(initialScreen);
  const account = useSelector((state) => state.account);
  const initialValidationData = {
    passwordValidateMessage: ""
  };
  const [validData, setValidation] = useState(initialValidationData);

  useEffect(() => {
    async function fetchHashCode() {
      if(window.location.search.split("=")[1]) {
        const hashCode = window.location.search.split("=")[1].split('&')[0];
        const userEmail = window.location.search.split("=")[2];
        if(hashCode && userEmail){
          const result = await accountHttpService.validateSecurityCode(userEmail, hashCode);
          if(result){
            setResponseEmail(userEmail);
            setResponseSecurityHash(hashCode);
            setScreens({ ...screens, isIdentifyScreen: false, isResetpasswordScreen: true });
          }
        }
      }
  }
  fetchHashCode();

  },[])

  function goBack() {
    history.push('/login');
  }

  function inputChange(value) {

    setInputIdentifire(value);
    if (value && !validateEmail(value)) {
      setInputError("Please enter valid email");
      return;
    }
    else{
      const error = value ? "" : "User needs to enter their email or username";
      setInputError(error);
    }

  }

  const onSendResetCode = () => {
    const error = inputIdentifire
      ? ""
      : "User needs to enter their email or username";
    setInputError(error);
    if (inputIdentifire) {
      accountHttpService
        .sendPasswordRecovryEmail(account.token, inputIdentifire)
        .then((res) => {
          if (res) {
            setResponseEmail(res.data.email)
            Toast.success('Reset code', res.data.message);
          }
        })
        .catch((error) => {
          Toast.error('error', error.response.data.message);

        });
    }
  };

  const onResetPasswordClick = () => {
    if(confirmPassword === newPassword){
      accountHttpService
      .resetPassword(securityHash, responseEmail, newPassword)
      .then((res) => {
        if (res.status === 200) {
          goBack();
          Toast.success('Reset password', 'Reset password has updated successfully');
        } else {
          //Toast.error('error', error.response.data.message);
        }
      })
      .catch((error) => {
        Toast.error('error', error.response.data.message);
      });
    }
  }

  const checkPasswordStrength = (pwd) => {
    const numberPattern = /[0-9]/;
    const uppercasePattern = /[A-Z]/;
    const specialCasePattern = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
    if (!pwd)
      return setValidation({ ...validData, passwordValidateMessage: "" });
    if (
      !numberPattern.test(pwd) ||
      !uppercasePattern.test(pwd) /*|| specialCasePattern.test(pwd)*/ ||
      (pwd.length < 8 && pwd.length >= 1)
    ) {
      setValidation({
        ...validData,
        passwordValidateMessage: REGISTRATION.PASSWORD_VALIDATE_MESSAGE,
      });
      return;
    } else {
      setValidation({ ...validData, passwordValidateMessage: "" });
      setNewPassword(pwd)
    }
  };

  return (
    <div
      style={{
        background: `url(${background}) no-repeat center fixed`,
        "background-size": "cover",
        height: "100%",
        width: "100%",
        textAlign: "center",
      }}
    >
      <ReactSVG src={PassageLogo}></ReactSVG>
      <Row justify="center" align="middle">
        <Col
          xs={18}
          sm={11}
          md={8}
          lg={8}
          xl={5}
          style={{
            backgroundColor: "#000",
            textAlign: "center",
            borderRadius: "24px",
            pointerEvents: "auto",
            paddingTop: "20px",
            maxWidth: "390px",
            minWidth: "390px",
          }}
        >
          {screens.isIdentifyScreen && <Row justify="center">
            <Col
              span={24}
              className="login-col"
              style={{
                color: "white",
                textAlign: "center",
                marginBottom: "7px",
                fontWeight: "normal",
                marginTop: "15px",
              }}
            >
              IDENTIFY YOUR ACCOUNT
            </Col>
            <Col span={24} className="mt-15" style={{ marginBottom: "7px" }}>
              <input
                className="auth-input"
                placeholder="Your email address"
                value={inputIdentifire}
                onChange={(e) => inputChange(e.target.value)}
              ></input>
              {inputError && <p className="validation_error">{inputError}</p>}
            </Col>
            <Col span={20} className="mt-15">
              <button className="auth-button" onClick={() => onSendResetCode()}>
                SEND A RESET CODE
              </button>
            </Col>
            <Col span={22} className="mt-15">
              <button
                onClick={() => {
                  goBack();
                }}
                className="auth-button"
                style={{
                  border: "none",
                  backgroundColor: "none",
                  marginBottom: "20px",
                  background: "none",
                }}
              >
                GO BACK
              </button>
            </Col>
          </Row>}

          {screens.isResetpasswordScreen && <Row justify="center">
            <Col
              span={24}
              className="login-col"
              style={{
                color: "white",
                textAlign: "center",
                marginBottom: "7px",
                fontWeight: "normal",
                marginTop: "15px",
              }}
            >
              RESET PASSWORD
            </Col>
            <Col span={24} className="mt-15 ant-notification-notice-message">
              <span>
                For: <strong>{responseEmail}</strong>
              </span>
            </Col>

            <Col span={24} className="mt-15">
              <div className="eye_icon">
                <input
                  onChange={(e) => checkPasswordStrength(e.target.value)}
                  type={isHidePassword ? "password" : "text"}
                  className="auth-input"
                  placeholder="NEW PASSWORD"
                />
                <button
                  type="button"
                  onClick={() => setShowHidePass(!isHidePassword)}
                >
                  {isHidePassword ? (
                    <ReactSVG src={hidePasswordIcon}></ReactSVG>
                  ) : (
                    <ReactSVG src={showPasswordIcon}></ReactSVG>
                  )}
                </button>
              </div>
            </Col>
            {validData.passwordValidateMessage && (
                    <Col span={24} className="validation_error">
                      {validData.passwordValidateMessage}
                    </Col>
                  )}
            <Col span={24} className="mt-15">
              <div className="eye_icon">
                <input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={isConfirmHidePassword ? "password" : "text"}
                  className="auth-input"
                  placeholder="CONFIRM PASSWORD"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmHidePass(!isConfirmHidePassword)}
                >
                  {isConfirmHidePassword ? (
                    <ReactSVG src={hidePasswordIcon}></ReactSVG>
                  ) : (
                    <ReactSVG src={showPasswordIcon}></ReactSVG>
                  )}
                </button>
              </div>

            </Col>

            {confirmPassword &&(confirmPassword !== newPassword) && <Col className="validation_error">Confirm password does not match.</Col>}

            <Col span={20} className="mt-15">
              <button className="auth-button" onClick={() => onResetPasswordClick()}>
                SET NEW PASSWORD
              </button>
            </Col>
            <Col span={22} className="mt-15">
              <button
                onClick={() => {
                  goBack();
                }}
                className="auth-button"
                style={{
                  border: "none",
                  backgroundColor: "none",
                  marginBottom: "20px",
                  background: "none",
                }}
              >
                Remembered password? LOG IN
              </button>
            </Col>
          </Row>}
        </Col>
      </Row>
    </div>
  );
}
