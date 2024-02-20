import React, { useState, useEffect } from "react";
import { CustomAvatar, CustomInput, CustomSearchInput } from "../custom";
import useDebounce from "../../hooks/useDebounce";
import socialService from "../../services/social";
import { useSelector } from "react-redux";
import { ReactComponent as SendIcon } from "../../assets/images-v2/send-icon.svg";
import { ReactComponent as SearchIcon } from "../../assets/images-v2/search.svg";
import { ReactComponent as AddIcon } from "../../assets/images-v2/add-icon.svg";
import { ReactComponent as AddActiveIcon } from "../../assets/images-v2/add-active-icon.svg";
import { ReactComponent as AcceptCheckIcon } from "../../assets/images-v2/accept-check.svg";
import { validateEmail } from "../../configs";
import Toast from "../custom/CustomToast";

const handleSendFriendRequest = async (email, updateList, setEmails) => {
  try {
    const payload = {
      emails: email
        .split(",")
        .map((el) => el.trim())
        .filter((el) => el),
    };
    await socialService.sendFriendRequest(payload);
    Toast.success( "Invitation Sent", "");
    updateList && updateList();
    setEmails && setEmails();
  } catch (error) {
    console.log(error);
    Toast.error("Unsuccessful", "Something went wrong, please try again!");
  }
};

const AddBySearch = ({ searchString = "", handleSearch }) => {
  return (
    <div className="saf-search-container">
      <CustomSearchInput
        placeholder="Search Users"
        onChange={handleSearch}
        value={searchString}
        maxLength={50}
        expanded={true}
        style={{ width: "100%" }}
        suffix={<SearchIcon />}
      />
    </div>
  );
};

const AddByEmail = ({
  emails = "",
  handleEmailInput,
  isValidEmail,
  sendFriendRequest,
  alreadyFreindsEmail
}) => {
  return (
    <div className="saf-search-container">
      <CustomSearchInput
        placeholder="Invite by Email Address"
        onChange={handleEmailInput}
        value={emails}
        maxLength={500}
        expanded={true}
        style={{ width: "100%" }}
        suffix={
          <SendIcon
            style={{ cursor: isValidEmail && !alreadyFreindsEmail ? "pointer" : "default" }}
            onClick={() => isValidEmail && !alreadyFreindsEmail ? sendFriendRequest() : ''}
          />
        }
      />
      <div>
        {emails && !isValidEmail && (
          <span className="error-text">Please enter valid email address.</span>
        )}
        {alreadyFreindsEmail ? (
          <div className="error-text">Already friends with: {alreadyFreindsEmail}</div>
        ) : ''}
      </div>
    </div>
  );
};

const SearchResult = ({ list, updateList, sendFriendRequest }) => {
  return (
    <div className="saf-search-result-list-container">
      {list.map((user, index) => (
        <div className="saf-user-result-wrapper" key={index}>
          <div className="left-block">
            <CustomAvatar size={36} image={user.profileImage} />
            <div className="name-label">{user.nickname}</div>
          </div>

          <div className="right-block">
            {user.isRequestSent ? (
              <>
                <span className="sent-text">Sent</span>
                <AcceptCheckIcon />
              </>
            ) : (
              <div className="accept-icon-wrapper">
                <AddIcon 
                  className="accept-icon" 
                  onClick={() => {
                    sendFriendRequest(user.email, updateList);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const AddFreind = ({ friendList }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchText = useDebounce(searchQuery, 500);
  const [searchList, setSearchList] = useState([]);
  const [emails, setEmails] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [alreadyFreindsEmail, setAlreadyFriendsEmail] = useState("")

  const account = useSelector((state) => state.account);

  useEffect(() => {
    if (debouncedSearchText) {
      fetchSearchResult();
    } else {
      setSearchList([]);
    }
  }, [debouncedSearchText]);

  const fetchSearchResult = async () => {
    try {
      const response = await socialService.searchUser({
        nickname: debouncedSearchText,
      });

      // Below lines to be used once defradb search issue is fixed, till now only one object will be returned
      let filteredList =
        response?.data?.users?.filter((user) => user.email !== account.email && !user.isFriend) ||
        [];
      setSearchList(filteredList);
    } catch (error) {
      console.log(error);
      setSearchList([]);
    }
  };

  const updateList = () => {
    fetchSearchResult();
  };

  const handleSearchInput = (str) => {
    setSearchQuery(str);
  };

  const handleEmailInput = (value) => {
    setEmails(value);
    const emails = value.replace(/\s/g, "").split(",");

    if (emails.every((email) => email)) {
      let isValid = emails.every((email) => {
        if (email === "") {
          return true;
        }
        return validateEmail(email);
      });
      setIsValidEmail(isValid);
      const friends = friendList.map(friend => friend.email)
      const alreadyFriendList = emails.filter(email => friends.includes(email))
      setAlreadyFriendsEmail(alreadyFriendList.join(', '))
    } else {
      setIsValidEmail(true);
    }
  };

  return (
    <div className="social2-add-friend-container">
      <div className="header-txt">Add Friend</div>
      {!emails ? (
        <AddBySearch
          searchString={searchQuery}
          handleSearch={handleSearchInput}
        />
      ) : (
        ""
      )}
      {!(emails || searchQuery) ? <div className="divider-txt">OR</div> : ""}
      {!searchQuery ? (
        <AddByEmail
          emails={emails}
          handleEmailInput={handleEmailInput}
          isValidEmail={isValidEmail}
          sendFriendRequest={() =>
            handleSendFriendRequest(emails, undefined, setEmails)
          }
          alreadyFreindsEmail={alreadyFreindsEmail}
        />
      ) : (
        ""
      )}
      {searchList.length > 0 ? (
        <SearchResult
          list={searchList}
          updateList={updateList}
          sendFriendRequest={handleSendFriendRequest}
        />
      ) : searchQuery ? <div style={{ color: '#fff', margin: 5 }}>No records.</div> : ''}
    </div>
  );
};

export default AddFreind;
