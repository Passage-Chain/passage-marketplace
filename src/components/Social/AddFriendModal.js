import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Input, Divider } from "antd";

import socialService from "../../services/social";
import useDebounce from "../../hooks/useDebounce";

import { ReactComponent as CloseIcon } from "../../assets/images/icon-close.svg";
import { ReactComponent as AddFriendIcon } from "../../assets/images/icon-add-friend.svg";
import { ReactComponent as SearchIcon } from "../../assets/images/icon-search.svg";
import { ReactComponent as EmailIcon } from "../../assets/images/icon-email.svg";
import { ReactComponent as SendIcon } from "../../assets/images/icon-send.svg";
import { ReactComponent as CancelRequestIcon } from "../../assets/images/icon-cancel-request.svg";
import { ReactComponent as CrossIcon } from "../../assets/images/icon-cross.svg";

import { CustomAvatar } from "../custom";
import Notify from "../utils/Notification/notify";
import { validateEmail } from "../../configs";
import ConfirmModal from "./ConfirmModal";

const preventClose = (e) => {
  e.stopPropagation();
};

const handleSendFriendRequest = async (email, updateList, setEmails) => {
  try {
    const payload = {
      emails: email
        .split(",")
        .map((el) => el.trim())
        .filter((el) => el),
    };
    const response = await socialService.sendFriendRequest(payload);
    Notify.success({ title: "Invitation Sent", body: "Your invitations were sent.", action: 'invite_success' });
    updateList && updateList();
    setEmails && setEmails();
  } catch (error) {
    console.log(error);
    Notify.error({ title: "Unsuccessful", body: "Something went wrong, please try again!" });
  }
};

const SearchResult = ({ list, updateList, friendList }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(undefined);
  const friendListIds = friendList.map((friend) => friend?.userId?._id);

  const handleCancelRequestClick = (user) => {
    setSelectedUser(user);
    setShowConfirmModal(true);
  };

  const handleCancelFriendRequest = async (user) => {
    try {
      const response = await socialService.cancelFriendRequest({
        email: user.email,
      });
      Notify.error({ title: "Invite Cancelled!", body: `You have cancelled your invitation for ${user?.userName}.`, action: 'invite_fail' });
      updateList();
    } catch (error) {
      console.log(error);
      Notify.error({ title: "Unsuccessful", body: "Something went wrong, please try again!" });
    }
    setSelectedUser(undefined);
    setShowConfirmModal(false);
  };

  return (
    <div onClick={preventClose}>
      {showConfirmModal && (
        <ConfirmModal
          user={selectedUser}
          type="cancel"
          onCancel={() => {
            setShowConfirmModal(false);
          }}
          onOkay={(user) => handleCancelFriendRequest(user)}
        />
      )}
      <div className="social__search-result-container" onClick={preventClose}>
        <div className="list-container">
          {list.map((user, index) => (
            <React.Fragment key={user.id}>
              <div className="result-wrapper">
                <div className="left">
                  <div className="user-icon-wrapper">
                    <CustomAvatar size={48} image={user.profileImage}/>
                  </div>
                  <div className="user-detail-wrapper">
                    <span className="username-text">{user.nickname}</span>
                    <span className="user-place-text">{user.email}</span>
                  </div>
                </div>

                {!friendListIds.includes(user.id) && (user.isRequestSent ? (
                  <div
                    className="social_cancel-request-btn"
                    onClick={() => handleCancelRequestClick(user)}
                  >
                    <CancelRequestIcon />
                    <span>CANCEL REQUEST</span>
                  </div>
                ) : (
                  <div
                    className="social__add-friend-btn"
                    onClick={() => {
                      handleSendFriendRequest(user.email, updateList);
                    }}
                  >
                    <AddFriendIcon />
                    <span>ADD FRIEND</span>
                  </div>
                ))}
              </div>
              {index < list.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

const AddFriendModal = ({ handleClose, friendList }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [searchList, setSearchList] = useState([]);
  const debouncedSearchText = useDebounce(searchQuery, 500);
  const [emails, setEmails] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(!emails);

  const account = useSelector((state) => state.account);

  useEffect(() => {
    if (debouncedSearchText) {
      fetchSearchResult();
    } else {
      setSearchList([]);
    }
  }, [debouncedSearchText]);

  useEffect(() => {
    setShowSearchResult(!!searchList.length);
  }, [searchList]);

  const fetchSearchResult = async () => {
    try {
      const response = await socialService.searchUser({
        userName: debouncedSearchText,
      });

      // Below lines to be used once defradb search issue is fixed, till now only one object will be returned
      // let filteredList =
      //   response?.data?.users?.filter((user) => user.email !== account.email) || [];
      // setSearchList(filteredList);
      setSearchList([response?.data?.user])
    } catch (error) {
      console.log(error);
      setSearchList([]);
    }
  };

  const handleSearchInput = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
  };

  const handleOutsideClick = () => {
    setShowSearchResult(false);
  };

  const handleEmailInput = (e) => {
    const { value } = e.target;
    setEmails(value);
    const emails = value.replace(/\s/g, "").split(",");

    if (emails.every((email) => email)) {
      let isValid = emails.every((email) => {
        if (email === "") {
          return true;
        }
        return validateEmail(email);
      });
      setIsValidEmail(!isValid);
    } else {
      setIsValidEmail(true);
    }
  };

  const isOwnEmail = (value = "") => {
    const emails = value.replace(/\s/g, "").split(",");
    return emails.some((email) => email.trim() === account.email);
  };

  return (
    <>
      <div
        className="social__add-friend-container"
        onClick={handleOutsideClick}
      >
        <div className="inner-container">
          <header>
            <div className="left">
              <AddFriendIcon />
              <span>ADD FRIEND</span>
            </div>
            <CloseIcon className="cursor-pointer" onClick={handleClose} />
          </header>

          <div className="content">
            <Input
              placeholder="Search Users"
              prefix={<SearchIcon />}
              className="search-box"
              onChange={handleSearchInput}
              onClick={preventClose}
              value={searchQuery}
              suffix={
                searchQuery ? (
                  <CrossIcon
                    className="cursor-pointer"
                    onClick={() => setSearchQuery("")}
                  />
                ) : (
                  <></>
                )
              }
            />
            {showSearchResult && (
              <SearchResult list={searchList} updateList={fetchSearchResult} friendList={friendList}/>
            )}

            <div className="or-text">
              <span>OR</span>
            </div>

            <div style={{ height: 70 }}>
              <div className="email-wrapper">
                <Input
                  placeholder="Invite by email address"
                  prefix={<EmailIcon />}
                  className="search-box"
                  onChange={handleEmailInput}
                  value={emails}
                  suffix={
                    emails ? (
                      <CrossIcon
                        className="cursor-pointer"
                        onClick={() => setEmails("")}
                      />
                    ) : (
                      <></>
                    )
                  }
                />
                <div
                  className={`send-icon-wrapper ${
                    isValidEmail ? "disabled-button" : ""
                  }`}
                  onClick={() => {
                    handleSendFriendRequest(emails, undefined, setEmails);
                  }}
                >
                  <div className="send-icon">
                    <SendIcon />
                  </div>
                </div>
              </div>
              <div>
                {emails && isValidEmail && (
                  <span className="error-text">
                    Please enter valid email address.
                  </span>
                )}
              </div>
            </div>
          </div>

          <footer>
            <button className="cursor-pointer" onClick={handleClose}>
              CLOSE
            </button>
          </footer>
        </div>
      </div>
    </>
  );
};

export default AddFriendModal;
