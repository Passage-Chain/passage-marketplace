import { useEffect, useState } from "react";
import axios from "axios";
import { ReactComponent as CloseIcon } from "../../../assets/images/icon-close.svg";
import { ReactComponent as UserSettingsIcon } from "../../../assets/images/icon-user-settings.svg";
import default_avatar from "../../../assets/images/left_menu_passageLogo.svg";
import FrontAvatar from "./FrontAvatar";
import BackAvatar from "./BackAvatar";
import RightSideBar from "./RightSideBar";
import WebCam from "./WebCam";
import { face, skin, back, head, leftHand, rightHand, sections } from "./data";
import { useDispatch, useSelector } from "react-redux";
import { setAvatar } from "../../../redux/accountSlice";
import "./style.scss";
import configURL from "./config";

import accountHttpService from "../../../services/account";
import Toast from "../../custom/CustomToast";
import { message } from "antd";

function CustomizeAvatarModal({
  open,
  handleClose,
  closeModal,
  applyAvatarChanges,
  profileData,
}) {
  let locallyStored = localStorage.getItem("avatar_customization_v2");
  locallyStored = locallyStored ? JSON.parse(locallyStored) : null;
  const dispatch = useDispatch();
  const [mode, setMode] = useState("front");
  const [active, setActive] = useState("face");
  const [isWebcam, openWebcam] = useState(false);
  const [avatar, setPublicAvatar] = useState(
    locallyStored || {
      face: face.length ? face[0] : { icon: default_avatar, id: null },
      skin: "#F54300",
      ring: "#003AFF",
      back: back.length ? back[1] : null,
      head: null,
      leftHand: null,
      rightHand: null,
      cameraImage: null,
    }
  );

  const changeAvatar = (data) => {
    setPublicAvatar((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const saveDataToApi = async (data) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const APIdata = Object.assign({}, avatar, {
      hatId: avatar.head ? avatar.head.id : null,
      leftHandId: avatar.leftHand ? avatar.leftHand.id : null,
      rightHandId: avatar.rightHand ? avatar.rightHand.id : null,
      innerRingColor: avatar.ring ? avatar.ring : "#003AFF",
      outerRingTexture: avatar.skin ? avatar.skin : "#F54300",
      sticker: "generallyAvailable",
    });
    try {
      const response = await axios.post(
        `${configURL.ASSET_MAPPING}`,
        APIdata,
        config
      );
      // console.log("this", response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // console.log("open", handleClose);
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userResponse = await axios.get(`${configURL.ASSET_MAPPING}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const responseData = await userResponse.data.data;
        // console.log("Responessee", responseData);
        const userAssetMappingData = (await userResponse?.data?.data
          ?.userAssetMapping)
          ? {
              face: face.length ? face[0] : { icon: default_avatar, id: null },
              skin: responseData.userAssetMapping.outerRingTexture,
              ring: responseData.userAssetMapping.innerRingColor,
              back: null,
              head: responseData.userAssetMapping.hatId
                ? {
                    id: responseData.userAssetMapping.hatId,
                    icon: responseData.userAssetMapping.hatIdDetail[0]["2dURI"],
                  }
                : null,
              leftHand: responseData.userAssetMapping.leftHandId
                ? {
                    id: responseData.userAssetMapping.leftHandId,
                    icon: responseData.userAssetMapping.leftHandIdDetail[0][
                      "2dURI"
                    ],
                  }
                : null,
              rightHand: responseData.userAssetMapping.rightHandId
                ? {
                    id: responseData.userAssetMapping.rightHandId,
                    icon: responseData.userAssetMapping.rightHandIdDetail[0][
                      "2dURI"
                    ],
                  }
                : null,
              sticker: "generallyAvailable",
            }
          : null;
        // console.log("Data received", userAssetMappingData);
        setPublicAvatar(
          userAssetMappingData ||
            locallyStored || {
              face: face.length ? face[0] : { icon: default_avatar, id: null },
              skin: "#F54300",
              ring: "#003AFF",
              back: back.length ? back[1] : null,
              head: null,
              leftHand: null,
              rightHand: null,
              cameraImage: null,
            }
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, [handleClose]);

  useEffect(() => {
    localStorage.setItem("avatar_customization_v2", JSON.stringify(avatar));
  }, [avatar]);

  const changeMode = () => {
    setMode((prev) => (prev === "front" ? "back" : "front"));
  };
  function urlToFile(url, filename, mimeType) {
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
  const getBinaryFileData = (dataUrl, name, type) => {
    urlToFile(dataUrl, name, type).then((res) => {
      const payloadData = Object.assign(profileData, {
        profileImage: res,
        updateImageFlag: true,
      });
      accountHttpService
        .updateUserPublicProfile(payloadData)
        .then((response) => {
          if (response.status === 200 && response.data) {
            Toast.success("User Profile", "User profile updated successfully");
          }
          dispatch(setAvatar(avatar?.face?.icon));
          applyAvatarChanges(avatar);
        })
        .catch((error) => {
          Toast.error("Error", error.data?.message);
        });
    });
  };
  const save = () => {
    applyAvatarChanges(avatar);
    saveDataToApi(avatar);

    if (avatar.cameraImage) {
      /** Logic for converting camera image to binary format
       * getting avatar.cameraImage in form of base64 url
       */
      getBinaryFileData(avatar.cameraImage, "profileImage.jpeg", "image/jpeg");
    } else {
      /** Logic for converting static image to binary format */
      staticToBase64(avatar?.face?.icon).then((dataUrl) => {
        getBinaryFileData(dataUrl, "profileImage.png", "image/png");
      });
    }
  };

  const openCamera = () => {
    openWebcam(true);
    setActive(null);
  };

  return (
    <div className='customize-avatar-modal'>
      <div className='modal-container'>
        <div className='head'>
          <div className='modal_title'>
            <UserSettingsIcon />
            <span>Customize Avatar</span>
          </div>
          <div
            className='confirm-modal__close cursor-pointer'
            onClick={() => {
              handleClose(false);
              // console.log("closed", handleClose);
            }}
          >
            <CloseIcon height={25} width={25} />
          </div>
        </div>
        <div className='main'>
          {mode === "front" ? (
            <>
              <FrontAvatar
                avatar={avatar}
                changeAvatar={changeAvatar}
                skins={skin}
                changeMode={changeMode}
                setActive={setActive}
                save={save}
                closeModal={closeModal}
              />
              <RightSideBar
                sections={sections}
                active={active}
                face={face}
                head={head}
                leftHand={leftHand}
                rightHand={rightHand}
                avatar={avatar}
                changeAvatar={changeAvatar}
                setActive={setActive}
                openCamera={openCamera}
              />
            </>
          ) : (
            <BackAvatar
              backs={back}
              avatar={avatar}
              changeAvatar={changeAvatar}
              changeMode={changeMode}
            />
          )}
        </div>
      </div>
      {!!isWebcam && (
        <WebCam saveWebCam={changeAvatar} openWebcam={openWebcam} />
      )}
    </div>
  );
}

export default CustomizeAvatarModal;
