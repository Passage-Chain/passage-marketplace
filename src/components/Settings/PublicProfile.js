import { useEffect, useState } from "react";
import "./index.scss";
import { Layout, Row, Col, notification } from "antd";
import { ReactSVG } from "react-svg";
import default_avatar from "../../assets/images/left_menu_passageLogo.svg";
import CustomInput from "../../components/custom/Input";
import FileUploader from "../shared/FileUpload/FileUploader";
import { useDispatch, useSelector } from "react-redux";
import accountHttpService from "../../services/account";
import Toast from "../custom/CustomToast";
import CustomizeAvatarModal from "./Avatar";
import { handleApiError } from "../utils/AuthVerify/AuthVerify";
import { setUsername, setAvatar } from "../../redux/accountSlice";
import PublicProfileAvatar from "./PublicProfileAvatar/PublicProfileAvatar";
const { Content } = Layout;

const PublicProfile = () => {
  let locallyStored = localStorage.getItem("avatar_customization_v2");
  locallyStored = locallyStored ? JSON.parse(locallyStored) : null;
  // locallyStored = locallyStored ? locallyStored?.face?.icon : null;
  const initialProfileData = {
    profileName: "",
    nickname: "",
    briefInfo: "",
    deleteImageFlag: false,
    updateImageFlag: false,
    profileImage: null,
  };
  const [profileData, setProfileData] = useState(initialProfileData);
  const account = useSelector((state) => state.account);
  const [isDefaultImage, setDefaultImage] = useState(false);
  const [isAvatar, openAvatar] = useState(false);
  const [ProfileNameErrorMsg, setProfileNameErrorMsg] = useState("");
  const prefix = "@";
  const dispatch = useDispatch();

  useEffect(() => {
    getUserProfileData();
  }, []);
  const getUserProfileData = () => {
    accountHttpService
      .getUserPublicProfile()
      .then((response) => {
        if (response.status === 200 && response.data) {
          const { nickname, profileName, briefInfo } = response.data;
          // if (response.data.imageUrl)
          //   setDisplayImage('data:image/jpeg;base64,' + btoa(response.data.imageUrl));
          // else
          //   setDisplayImage((locallyStored?.cameraImage || locallyStored?.face?.icon || default_avatar))
          if (response.data.profileImage === null) {
            setDefaultImage(true);
          }
          setProfileData(() => ({
            ...profileData,
            nickname: nickname || "",
            profileName: profileName || "",
            profileImage:
              locallyStored?.cameraImage ||
              locallyStored?.face?.icon ||
              account.avatar ||
              default_avatar,
            briefInfo: briefInfo || "",
          }));
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  };
  const toDataURL = (url) =>
    fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );
  const onSaveClick = () => {
    // setProfileData({
    //   ...profileData,
    //   profileImage: binaryData || ''
    // });
    //   toDataURL(profileData.profileImage)
    // .then(dataUrl => {
    //   console.log('RESULT:', dataUrl)
    // })

    if (ProfileNameErrorMsg) {
      return;
    }
    console.log("profileData :", profileData);
    accountHttpService
      .updateUserPublicProfile(profileData)
      .then((response) => {
        if (response.status === 200 && response.data) {
          Toast.success("User Profile", "User profile updated successfully");
        }
        const t = Object.assign(profileData, { updateImageFlag: false });
        setProfileData(t);
        dispatch(setUsername(profileData.nickname));
        dispatch(
          setAvatar(
            locallyStored?.cameraImage ||
              locallyStored?.face?.icon ||
              account.avatar ||
              default_avatar
          )
        );
      })
      .catch((error) => {
        //handleApiError(error);
      });
  };
  function urltoFile(url, filename, mimeType) {
    if (url.startsWith("data:")) {
      var arr = url.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      var file = new File([u8arr], filename, { type: mime || mimeType });
      return Promise.resolve(file);
    }
    return fetch(url)
      .then((res) => res.arrayBuffer())
      .then((buf) => new File([buf], filename, { type: mimeType }));
  }
  const staticToBase64 = (url) =>
    fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );
  const applyAvatarChanges = (avatar) => {
    if (avatar.cameraImage) {
      /** Logic for converting camera image to binary format */
      urltoFile(avatar.cameraImage, "profileImage.jpeg", "image/jpeg").then(
        (res) => {
          const t = Object.assign(profileData, {
            profileImage: res,
            updateImageFlag: true,
          });
          setProfileData(t);
          // setDisplayImage(avatar?.cameraImage ? avatar.cameraImage : avatar?.face?.icon);
        }
      );
    } else {
      /** Logic for converting static image to binary format */
      staticToBase64(avatar?.face?.icon).then((dataUrl) => {
        urltoFile(dataUrl, "profileImage.png", "image/png").then((res) => {
          const t = Object.assign(profileData, {
            profileImage: res,
            updateImageFlag: true,
          });
          setProfileData(t);
          // setDisplayImage(avatar?.cameraImage ? avatar.cameraImage : avatar?.face?.icon);
        });
      });
    }
    setDefaultImage(false);
    openAvatar(false);
  };

  const closeModal = () => {
    openAvatar(false);
  };

  function onCloseClick(e) {
    openAvatar(e);
    localStorage.removeItem("avatar_customization_v2");
  }
  const validateProfileName = (profileName) => {
    if (profileName.length < 3 || profileName.length > 15) {
      setProfileNameErrorMsg("PassageTag length should be min 3 & max 15");
      setProfileData({ ...profileData, nickname: profileName });
    } else {
      setProfileData({ ...profileData, nickname: profileName });
      setProfileNameErrorMsg("");
    }
  };
  return (
    <Layout
      className='site-layout background-none'
      style={{ "background-color": "#001529" }}
    >
      <Content
        style={{
          minHeight: 280,
        }}
      >
        {/** Default Avatar Section */}
        <h2 className='public_profile_heading' style={{ fontSize: "24px" }}>
          Public Profile
        </h2>
        <div className='section-layout-outer'>
          <div className='section-header'>AVATAR</div>
          <div className='section-layout-inner' style={{ height: "192px" }}>
            <Row align='center' style={{ width: "100%" }}>
              <Col span={10}>
                {isDefaultImage ? (
                  <img
                    src={default_avatar}
                    style={{ height: "7.15rem", width: "7.15rem" }}
                    alt=''
                  ></img>
                ) : (
                  <PublicProfileAvatar
                    avatar={locallyStored || profileData.profileImage}
                  />
                )}
              </Col>
              <Col span={14}>
                <button
                  className='setting-button setting-button-active'
                  onClick={openAvatar}
                >
                  CUSTOMIZE AVATAR
                </button>
              </Col>
            </Row>
          </div>
        </div>
        {/** Passage ID */}
        <div className='section-layout-outer mt-15'>
          <div className='section-header'>DESCRIPTION</div>
          <div className='section-layout-inner' style={{ maxHeight: "auto" }}>
            <Row align='center' style={{ width: "100%" }}>
              {/* <Col span={12} className="p5">
                <label className="input-lable">PROFILE NAME</label>
                <CustomInput
                  type='text'
                  placeHolder='PROFILE NAME'
                  value={profileData.profileName}
                  maxLength={15}
                  minLength={3}
                  onChange={e =>
                    validateProfileName(e.target.value)
                    }
                ></CustomInput>
              </Col> */}
              <Col span={24}>
                <label className='input-lable'>PASSAGE TAG</label>
                <CustomInput
                  type='text'
                  placeHolder={"PASSAGE TAG"}
                  maxLength={15}
                  minLength={3}
                  prefix='@'
                  divWidth={"50%"}
                  value={profileData.nickname}
                  onChange={(e) => validateProfileName(e.target.value)}
                  // onChange={e => setProfileData({ ...profileData, nickname: e.target.value })}
                ></CustomInput>
              </Col>
              {ProfileNameErrorMsg && (
                <Col span={24} className='validation_error'>
                  {ProfileNameErrorMsg}
                </Col>
              )}
              <Col span={24}>
                <textarea
                  cols={12}
                  type='text'
                  value={profileData.briefInfo}
                  className='auth-input mt-15 border-white input-textarea'
                  placeholder='TELL US ABOUT YOURSELF'
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      briefInfo: e.target.value,
                    })
                  }
                  maxLength={243}
                />
              </Col>
              <Col span={24}>
                <small style={{ color: "#fff" }}>
                  Max length for description is 243 characters
                </small>
              </Col>
            </Row>
            {/* <Row>
            {ProfileNameErrorMsg && (
                    <Col span={24} className="validation_error">
                      {ProfileNameErrorMsg}
                    </Col>
                  )}
            </Row> */}
          </div>
        </div>
        {/** Brief Info */}
        {/* <div className="section-layout-outer mt-15">
          <div className="section-header">BRIEF INFO</div>
          <div className="section-layout-inner" style={{ height: "180px" }}>
            <Row align="center" style={{ width: "100%" }}>
              <Col span={24}>
                <textarea
                  cols={12}
                  type='text'
                  value={profileData.briefInfo}
                  className='auth-input mt-15 border-white input-textarea'
                  placeholder='TELL US ABOUT YOURSELF'
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      briefInfo: e.target.value,
                    })
                  }
                  maxLength={243}
                />
              </Col>
              <Col span={24}>
                <small style={{ color: "#fff" }}>
                  Max length for brief info is 243 characters
                </small>
              </Col>
            </Row>
          </div>
        </div> */}
        <Row align='left' className='mt-15'>
          <Col>
            <button
              className='setting-button setting-button-active'
              onClick={onSaveClick}
            >
              SAVE CHANGES
            </button>
          </Col>
        </Row>
      </Content>
      {!!isAvatar && (
        <CustomizeAvatarModal
          handleClose={openAvatar}
          closeModal={closeModal}
          applyAvatarChanges={applyAvatarChanges}
        />
      )}
    </Layout>
  );
};

export default PublicProfile;
