import { useEffect, useState } from "react";

import { Layout, Row, Col } from 'antd';
import accountHttpService from "../../services/account";

import showPasswordIcon from "../../assets/images/show_password.svg";
import hidePasswordIcon from "../../assets/images/hide_password.svg";
import { ReactSVG } from 'react-svg';
import { validateEmail } from "../../configs";
import { useSelector } from "react-redux";
import Toast from "../custom/CustomToast";
import { REGISTRATION } from '../shared/globalConstant';
import { useHistory } from 'react-router-dom';
import "./index.scss";

const { Header, Sider, Content } = Layout;

const Account = () => {
  const [userDetails, setUserDetails] = useState(undefined);
  const [userEmail, setUserEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [isHideCurrentPassword, setShowHideCurrentPass] = useState(true);
  const [isHideNewPassword, setShowHideNewPass] = useState(true);
  const [isHideConfirmPassword, setShowHideConfirmPass] = useState(true);
  const history = useHistory();
  const initialValidationData = {
    emailValidateMessage: ''
  };
  const [validData, setValidation] = useState(initialValidationData);
  const account = useSelector((state) => state.account);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    accountHttpService
      .whoami()
      .then((response) => {
        if (response) {
          setUserDetails(response.data);
          setUserEmail(response.data.email);
        }
      })
      .catch((error) => {
        Toast.error("Error", error.response.data.message);

      });
  };

  const handleCurrentPasswordChange = (e) => {
    const { value } = e.target;
    setCurrentPassword(value);
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setConfirmPassword(value);
    if (value !== newPassword) {
      setConfirmPasswordError(
        "Confirm password and new password are different."
      );
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleNewPasswordChange = (e) => {
    const { value } = e.target;
    setNewPassword(value);
    checkPasswordStrength(value);
  };

  const handleSubmit = async () => {
    accountHttpService
      .updateUserDetails(userEmail, currentPassword, newPassword)
      .then((response) => {
        if (response) {
          Toast.success('User Account', "Account details have been updated successfully!");
          resetForm();
        }
      })
      .catch((error) => {
        Toast.error('Error', error.response?.data?.Error);

      });
  };

  const resetForm = () => {
    setUserEmail(userDetails?.email);
    setValidation({ ...validData, emailValidateMessage: '' });
    setConfirmPassword("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPasswordError("");
    setNewPasswordError("");
    setCurrentPasswordError("");
  };

  const isValid = () => {
    return (
      !validData.emailValidateMessage &&
      userEmail &&
      newPassword &&
      confirmPassword &&
      currentPassword &&
      !newPasswordError &&
      !confirmPasswordError &&
      !currentPasswordError
    );
  };

  const onEmailChange = (email) => {
    setUserEmail(email);
    if (email && !validateEmail(email)) {
      setValidation({ ...validData, emailValidateMessage: 'Please enter valid email' });
      return;
    }
    setValidation({ ...validData, emailValidateMessage: '' });
  }
  const checkPasswordStrength = (pwd) => {
    const numberPattern = /[0-9]/;
    const uppercasePattern = /[A-Z]/;
    const specialCasePattern = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
    if (!pwd)
      return setNewPasswordError("");
    if (
      !numberPattern.test(pwd) ||
      !uppercasePattern.test(pwd) /*|| specialCasePattern.test(pwd)*/ ||
      (pwd.length < 8 && pwd.length >= 1)
    ) {
      setNewPasswordError(REGISTRATION.PASSWORD_VALIDATE_MESSAGE);
      return;
    } else {
      setNewPasswordError("");
      setNewPassword(pwd)
    }
  };
  return (
    <>
      <Layout
        className="site-layout background-none"
        style={{ "background-color": "#001529" }}
      >
        <Content>
          <h2 className="setting-header" style={{ fontSize: '24px' }}>ACCOUNT SETTINGS</h2>
          <div className='section-layout-outer mt-15'>
            <div className='section-header'>
              EMAIL
            </div>
            <div className='section-layout-inner' style={{ height: '138px' }}>
              <Row align='center' style={{ width: "100%" }}>
                <Col span={24}>
                  <input type="text" className='auth-input mt-15 border-white' placeholder='EMAIL' value={userEmail} onChange={(event) => { onEmailChange(event.currentTarget.value) }} />
                </Col>

                {validData.emailValidateMessage && <Col span={24} className="validation_error">{validData.emailValidateMessage}</Col>}
              </Row>
            </div>
          </div>
          <div className='section-layout-outer mt-15'>
            <div className='section-header'>
              CHANGE PASSWORD
            </div>
            <div className='section-layout-inner' style={{ "maxHeight": '400px' }}>
              <Row align='center' style={{ width: "100%" }}>
                <Col span={24} style={{ marginBottom: "8px" }}>
                  <label className="label-text">CURRENT PASSWORD</label>
                  <div className="eye_icon">
                    <input
                      onChange={handleCurrentPasswordChange}
                      type={isHideCurrentPassword ? "password" : "text"}
                      className="auth-input"
                      placeholder="CURRENT PASSWORD"
                      value={currentPassword}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      style={{ right: "88px", top: '58%' }}
                      onClick={() => setShowHideCurrentPass(!isHideCurrentPassword)}
                    >
                      {isHideCurrentPassword ? (
                        <ReactSVG src={hidePasswordIcon}></ReactSVG>
                      ) : (
                        <ReactSVG src={showPasswordIcon}></ReactSVG>
                      )}
                    </button>
                  </div>
                </Col>
                <Col span={24} style={{ marginBottom: "8px", marginTop: "10px" }}>
                  <label className="label-text">NEW PASSWORD</label>
                  <div className="eye_icon">
                    <input
                      onChange={handleNewPasswordChange}
                      type={isHideNewPassword ? "password" : "text"}
                      className="auth-input"
                      placeholder="NEW PASSWORD"
                      value={newPassword}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      style={{ right: "88px", top: '58%' }}
                      onClick={() => setShowHideNewPass(!isHideNewPassword)}
                    >
                      {isHideNewPassword ? (
                        <ReactSVG src={hidePasswordIcon}></ReactSVG>
                      ) : (
                        <ReactSVG src={showPasswordIcon}></ReactSVG>
                      )}
                    </button>
                  </div>
                </Col>
                {newPassword && <Col span={24} className="validation_error">{newPasswordError}</Col>}
                <Col span={24} style={{ marginBottom: "8px", marginTop: "10px" }}>
                  <label className="label-text">CONFIRM PASSWORD</label>
                  <div className="eye_icon">
                    <input
                      onChange={handleConfirmPasswordChange}
                      type={isHideConfirmPassword ? "password" : "text"}
                      className="auth-input"
                      placeholder="CONFIRM PASSWORD"
                      value={confirmPassword}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      style={{ right: "88px", top: '58%' }}
                      onClick={() => setShowHideConfirmPass(!isHideConfirmPassword)}
                    >
                      {isHideConfirmPassword ? (
                        <ReactSVG src={hidePasswordIcon}></ReactSVG>
                      ) : (
                        <ReactSVG src={showPasswordIcon}></ReactSVG>
                      )}
                    </button>
                  </div>
                </Col>
                {confirmPassword && (confirmPassword !== newPassword) && <Col span={24} className="validation_error">{confirmPasswordError}</Col>}

              </Row>
            </div>
          </div>
          <Row align='left' className='mt-15'>
            <Col>
              <button
                type="submit"
                className={!isValid()? 'setting-button setting-button-active' : 'setting-button setting-button-active setting-button-hover'}
                onClick={handleSubmit}
                disabled={!isValid()}>
                SAVE CHANGES
              </button>
            </Col>
            <Col style={{ marginLeft: "15px" }}>
              <button className='setting-button setting-button-active setting-button-hover' onClick={resetForm}>
                CANCEL
              </button>
            </Col>
          </Row>
        </Content>
      </Layout>
    </>
  );
};

export default Account;
