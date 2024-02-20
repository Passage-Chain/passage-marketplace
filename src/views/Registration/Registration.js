import React from "react";
import { Checkbox, Row, Col, Modal } from "antd";
import { useState, useEffect } from "react";
import { ReactSVG } from "react-svg";
import "../../styles/style.css";
import "./index.scss"

import accountHttpService from "../../services/account";
import { useHistory, Redirect } from "react-router-dom";
import { setLogin as setReduxLogin, setToken } from "../../redux/accountSlice";
import { setAddress, setNftConnected } from "../../redux/walletSlice";

import { useDispatch, useSelector } from "react-redux";
import passageBg from "../../assets/images/signIn_bg.png";
import signIn from "../../assets/images/sign_in.svg";
import signInRef from "../../assets/images/sign_in_ref.svg";
import PassageLogo from "../../assets/images/Passage_VerticalLogoWhite 1.svg";
import showPasswordIcon from "../../assets/images/show_password.svg";
import createAction from "../../assets/images/create_action.svg";
import hidePasswordIcon from "../../assets/images/hide_password.svg";
import { REGISTRATION } from "../../components/shared/globalConstant";
import { validateEmail } from "../../configs/index";
import Toast from '../../components/custom/CustomToast';
import { TRACKING_ID } from '../../utils/globalConstant';
import { googleAnalyticsActions } from "../../utils/googleAnalyticsInit";
import TermAndCondition from './TermAndCondition';

export default function Registration() {
  const token = useSelector(state => state.account.token)

  const [login, setLogin] = useState("");
  const [publicUserName, setPublicUserName] = useState("");
  const [password, setPassword] = useState("");
  const initialValidationData = {
    emailValidateMessage: "",
    passwordValidateMessage: "",
    userNameValidateMessage: "",
  };

  const [isHidePassword, setShowHidePass] = useState(true);
  const [validData, setValidation] = useState(initialValidationData);
  const [isReciveSpecialOffer, setOffer] = useState(true);
  const [isTermCheck, setTermCheck] = useState(false);
  const [isDisabled, setDisabled] = useState(true);

  const history = useHistory();
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const [open, setOpen] = useState(false);


  useEffect(() => {
    dispatch(setAddress(null));
    dispatch(setNftConnected(true)); // to be false by default, it can be set true to unblock testing
  }, []);
  useEffect(()=>{
    const keyHandle = event => {
      if(event.key === 'Enter'){
        event.preventDefault();
        checkSubmitButtonEnable();
        if(isDisabled){
          Toast.error(
            REGISTRATION.INVALID_FILDS,
            REGISTRATION.FILL_ALL_FILDS,
         );
        } else {
          registerPressed();
        }
      }
    }
    document.addEventListener('keydown', keyHandle);
    return ()=>{
      document.removeEventListener('keydown', keyHandle);
    }
  });

  function registerPressed() {
    if (!login || !password) {
      Toast.error(
         REGISTRATION.INVALID_FILDS,
         REGISTRATION.FILL_ALL_FILDS,
      );
      return;
    }

    const userDetails = {
      logInUser: login,
      password: password,
      publicUserName: publicUserName,
      accessCode: '12',
      isConditionsAgreed: isTermCheck,
      receiveNews: isReciveSpecialOffer
    }
    //TODO: temporary sending hard code value 12 here as per discusion with backend need to remove once getting confirmation.
    accountHttpService
      .register(userDetails)
      .then((response) => {
        if (response.status === 200 && response?.data?.token) {

          dispatch(setReduxLogin(login));
          localStorage.setItem('token', response.data.token)
          dispatch(setToken(response?.data?.token));

          history.push("/discover");
          Toast.success("Register Successful", "You have registered successfully.");
          googleAnalyticsActions.initGoogleAnalytics(TRACKING_ID, 'Register', 'Register_Successful');
        }
      })
      .catch((error) => {
        Toast.error('error', error.response.data.message);
      });
  }
  useEffect(() => {
    checkSubmitButtonEnable();
  }, [validData, isTermCheck]);

  function cancelPressed() {
    history.goBack();
  }

  const checkSubmitButtonEnable = () => {
    for (const property in validData) {
      if (!isTermCheck || validData[property] !== "" || !login || !password || !publicUserName)
        return setDisabled(true);
    }
    return setDisabled(false);
  };

  const showModal = () => {
    setOpen(true);
  };
  const hideModal = () => {
    setOpen(false);
  };

  const onEmailChange = (email) => {
    if (email && !validateEmail(email)) {
      setValidation({
        ...validData,
        emailValidateMessage: REGISTRATION.ENTER_VALID_EMAIL,
      });
      checkSubmitButtonEnable();
      return;
    } else {
      setValidation({ ...validData, emailValidateMessage: "" });
      setLogin(email);
      checkSubmitButtonEnable();
    }
  };

  const checkPasswordStrength = (pwd) => {
    const numberPattern = /[0-9]/;
    const uppercasePattern = /[A-Z]/;
    //const specialCasePattern = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
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
      checkSubmitButtonEnable();
      return;
    } else {
      setValidation({ ...validData, passwordValidateMessage: "" });
      setPassword(pwd);
      checkSubmitButtonEnable();
    }
  };

  const checkIsValidUser = (userName) => {
    if (userName) {
      accountHttpService
        .uniqueUserName(userName, account.token)
        .then((response) => {
          if (response.status === 200) {
            if (response.data.message !== REGISTRATION.USERNAME_VALID) {
              setValidation({
                ...validData,
                userNameValidateMessage: response.data.message,
              });
            } else {
              setValidation({ ...validData, userNameValidateMessage: "" });
            }
          }
        })
        .catch((error) => {
          setValidation({ ...validData, userNameValidateMessage: error?.response?.data?.message  || "This username is already taken"});
          Toast.error('error', error?.response?.data?.message || "This username is already taken");
        });
    }
  };

  const checkIsValidEmail = (email) => {
    if (email) {
      accountHttpService
        .uniqueEmail(email)
        .then((response) => {
          if (response.status === 200) {
            if (response.data.message !== REGISTRATION.EMAIL_VALID) {
              setValidation({
                ...validData,
                emailValidateMessage: response?.data?.message,
              });
            } else {
              setValidation({ ...validData, emailValidateMessage: "" });
            }
          }
        })
        .catch((error) => {
          Toast.error('error', error?.response?.data?.message || "This email is already taken");
          setValidation({ ...validData, emailValidateMessage: error?.response?.data?.message || "This email is already taken" });
        });

    }
  };
  const onUsernameChange = (e) => {
    setPublicUserName(e.currentTarget.value);
    if(!e.currentTarget.value){
      setValidation({ ...validData, userNameValidateMessage: ''});
    }
    if(e.currentTarget.value.length<3||e.currentTarget.value.length>15)
      {
        setValidation({ ...validData, userNameValidateMessage: 'ProfileName length should be min 3 & max 15'});
      }
      else
      setValidation({ ...validData, userNameValidateMessage: ''});
  }
  function onTermCheck(flag) {
    setTermCheck(flag);
    //checkSubmitButtonEnable();
  }

  if (token) {
    return <Redirect to='/discover' />
  }

  return (
    <>
      <div
        className="someClassName"
        style={{
          background: `url(${passageBg}) no-repeat center fixed`,
          "background-size": "cover",
          height: "100%",
          width: "100%",
        }}
      >
        <Row>
          <Col span={16}>
            <ReactSVG src={signIn}></ReactSVG>
            <ReactSVG src={signInRef}></ReactSVG>
          </Col>
          <Col span={8}>
            <Row>
              <Col
                className=""
                xs={18}
                sm={11}
                md={8}
                lg={8}
                xl={5}
                style={{
                  background: "rgba(35, 35, 37, 0.48)",
                  top: "93px",
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
                    className="login-col"
                    style={{
                      color: "white",
                      textAlign: "center",
                      marginBottom: "20px",
                      fontWeight: "normal",
                      marginTop: "5px",
                    }}
                  >
                    GET STARTED
                    <p className="checkbox_text" style={{ textAlign: 'center', padding: '0 10px' }}>Note: Sign Up is currently only open to Closed Alpha participants. If you are having trouble signing up and are on the Closed Alpha list, please contact us on the Passage Discord.</p>
                  </Col>
                  <Col span={24}>
                    <input
                      onChange={(event) => {
                        onEmailChange(event.currentTarget.value);
                      }}
                      autocomplete="new-password"
                      className="auth-input"
                      name="email"
                      placeholder="EMAIL"
                      onBlur={e => checkIsValidEmail(e.currentTarget.value)}
                    />
                  </Col>
                  {validData.emailValidateMessage && (
                    <Col span={24} className="validation_error">
                      {validData.emailValidateMessage}
                    </Col>
                  )}
                  <Col span={24} className="mt-15">
                    <input
                      onChange={(event) => onUsernameChange(event)}
                      className="auth-input"
                      placeholder="USERNAME"
                      onBlur={(e) => checkIsValidUser(e.currentTarget.value)}
                      autocomplete="new-password"
                    />
                  </Col>
                  {validData.userNameValidateMessage && (
                    <Col span={24} className="validation_error">
                      {validData.userNameValidateMessage}
                    </Col>
                  )}
                  <Col span={24} className="mt-15">
                    <div className="eye_icon">
                      <input
                        onChange={(event) => {
                          checkPasswordStrength(event.currentTarget.value);
                        }}
                        type={isHidePassword ? "password" : "text"}
                        className="auth-input"
                        placeholder="PASSWORD"
                        autocomplete="new-password"
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
                  <Col span={20} className="mt-15 term_condition">
                    <Checkbox
                      defaultChecked={isReciveSpecialOffer}
                      onChange={() => setOffer(!isReciveSpecialOffer)}
                    >
                    </Checkbox>
                    <span className="checkbox_text">I want to receive news and special offers from Passage.</span>
                  </Col>
                  <Col span={20} className="mt-15 term_condition">
                    <Checkbox
                    defaultChecked={isTermCheck}
                    onChange={() => onTermCheck(!isTermCheck)}
                    >
                    </Checkbox>
                    <span className="checkbox_text">I've read and agree to the{" "} <strong onClick={showModal} style={{cursor: "pointer"}}>Terms of Service</strong></span>
                  </Col>
                  <Modal
                    className="term_modal"
                    visible={open}
                    onOk={hideModal}
                    onCancel={hideModal}
                  >
                    <TermAndCondition />
                  </Modal>
                  <Col className="mt-15" span={20}>
                    <button
                      onClick={() => {
                        registerPressed();
                      }}
                      className={isDisabled ? 'create-account-button':'auth-button'}
                      disabled={isDisabled}
                    >
                      CREATE AN ACCOUNT
                    </button>
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
                  >
                  </Col>
                  <Col style={{ marginBottom: 12, marginTop: 12 }} span={24}>
                    <button
                      className="auth-button"
                      onClick={cancelPressed}
                      style={{
                        border: "none",
                        backgroundColor: "none",
                        marginBottom: "20px",
                        background: "none",
                      }}
                    >
                      ALREADY HAVE AN ACCOUNT? SIGN IN
                      <ReactSVG
                        src={createAction}
                        style={{
                          display: "inline-block",
                          marginLeft: "10px",
                        }}
                      ></ReactSVG>
                    </button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}
