import React, { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";

import ChatWindowLayout from "./Window/ChatWindowLayout";
import ChatWrapper from "./ChatWrapper";
import ConfirmModal from "../Social-v2/ConfirmModal";

import Popup from "./Popup";
import { getSecretKey } from "./utils";

import {
  setViewMemberList,
  setUpdateTimestamp,
  setChatUserId,
  setShowChatWindow,
  setChatMessage,
  setIsDM,
  setUnreadCount,
  setDmTimestamp,
  setChatType
} from "../../redux/chatSlice";

import "stream-chat-react/dist/css/index.css";
import { useDispatch, useSelector } from "react-redux";
import { STREAM_API_KEY } from "../../configs";
import { useHistory } from "react-router-dom";
import Toast from "../custom/CustomToast";
import chatService from "../../services/chatService";
import { CustomAvatar } from "../custom";

const client = StreamChat.getInstance(STREAM_API_KEY);

const VIEW_MODES = {
  window: "window",
  popup: "popup",
};

const ACTIONS = {
  MUTE_GROUP: "muteGroup",
  LEAVE_GROUP: "leaveGroup",
};

export default function ({
  chatViewMode = VIEW_MODES.window,
  onClose,
  show
}) {
  const [viewMode, setViewMode] = useState();
  const account = useSelector((state) => state.account);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(undefined);
  const { isDM } = useSelector(state => state.chat)
  const [channelName, setChannelName] = useState('')

  const { activeChannel } = useSelector((state) => state.chat);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (show) {
      dispatch(setUnreadCount(0))
    }
  })

  useEffect(() => {
    setViewMode(chatViewMode)
  }, [chatViewMode])

  useEffect(() => {
    return () => {
      dispatch(setChatMessage(''))
      dispatch(setChatUserId(undefined))
      dispatch(setShowChatWindow(false))
      dispatch(setIsDM(false))
      dispatch(setChatType(''))
    }
  }, [])

  useEffect(() => {
    if (isDM) {
      setViewMode(VIEW_MODES.popup)
    }
  }, [isDM])

  useEffect(() => {
    if (actionType) {
      setShowConfirmModal(true);
    }
  }, [actionType]);

  useEffect(() => {
    return () => {
      dispatch(setViewMemberList(false));
    };
  }, []);

  useEffect(() => {
    window.onbeforeunload = () => {
      localStorage.setItem(
        "last_seen",
        JSON.stringify({ [account.id]: new Date() })
      );
    };
  }, []);

  useEffect(() => {
    let newMessageListner;
    if (account.id && account.username) {
      if (!client?._user) {
        const connectUser = async () => {
          try {
            const secretKey = await getSecretKey();
            const res = await client.connectUser(
              {
                id: account.id,
                name: account.username,
              },
              secretKey
            );
            dispatch(setUnreadCount(client?.user?.unread_channels))

            newMessageListner = client.on('message.new',(event) => {
              if (event?.unread_channels !== undefined) {
                dispatch(setUnreadCount(event?.unread_channels))
              }
              if (event?.user?.id !== account?.id) {
                let channelName = event?.channel_type === 'team' ? event?.message?.channel_name : event?.user?.name
                Toast.success(<><b>{channelName}</b></>,
                  <>{event?.message?.text}</>,
                  {
                    logo: <CustomAvatar name={channelName} size={35} image={event?.user?.profileImage}/>,
                    handleClick: () => handleSendMessage(event?.channel_type === 'team' ? event.cid : event?.user?.id, event?.channel_type)
                  }
                )
              }
            })
          } catch (err) {
            //Toast.error("error", err.response?.data?.message);
            if (err.response?.status) history.push("/");
          }
        };
        connectUser();
      }
    }

    return () => {
      newMessageListner?.unsubscribe()
      client.disconnectUser()
    }
  }, [account.id, account.username]);

  const handleSendMessage = (userId, chatType) => {
    dispatch(setChatUserId(userId))
    dispatch(setIsDM(true))
    dispatch(setShowChatWindow(true))
    dispatch(setDmTimestamp(new Date().getTime()))
    dispatch(setChatType(chatType))
  }

  const handleMinimize = () => {
    setViewMode(VIEW_MODES.popup);
  };

  const handleMaximize = () => {
    setViewMode(VIEW_MODES.window);
  };

  const leaveGroup = async () => {
    try {
      const payload = {
        id: activeChannel?.id,
      };
      const response = await chatService.leaveGroup(payload);
      dispatch(setUpdateTimestamp(new Date().getTime()));
      Toast.success( "Left Group", <div>You have left the group <b>{channelName}</b>!</div>, "left_group" );
    } catch (error) {
      console.log(error);
      Toast.error( "Unsuccessful", "Something went wrong, please try again!" );
    }
    setShowConfirmModal(false);
    setActionType(undefined);
  };

  const muteGroup = async () => {
    try {
      if(activeChannel?.type === "team") {
        const payload = {
          id: activeChannel?.id,
        };
        const response = await chatService.muteGroup(payload);
      }
      await activeChannel.mute();
      dispatch(setUpdateTimestamp(new Date().getTime()));
      Toast.success("Notifications Muted!", <div>
      You have muted notifications for {activeChannel?.type === "team" ? 'Group' : ''} <b>{channelName}</b>!
    </div> );
    } catch (error) {
      console.log(error);
      Toast.error("Unsuccessful", "Something went wrong, please try again!" );
    }
    setShowConfirmModal(false);
    setActionType(undefined);
  };

  return (
    <div className={!show ? 'hide' : ''}>
      <Chat client={client} theme="messaging dark">
        <ChatWrapper setIsLoading={setIsLoading} setChannelName={setChannelName}>
          {viewMode === VIEW_MODES.window ? (
            <ChatWindowLayout
              onExitMassagesClick={onClose}
              handleMinimize={handleMinimize}
              setIsLoading={setIsLoading}
              actionType={actionType}
              setActionType={setActionType}
              showConfirmModal={showConfirmModal}
              setShowConfirmModal={setShowConfirmModal}
              isLoading={isLoading}
            />
          ) : (
            <Popup
              onExitMassagesClick={() => {
                setViewMode(VIEW_MODES.window)
                onClose()}
              }
              handleMaximize={handleMaximize}
              actionType={actionType}
              setActionType={setActionType}
              showConfirmModal={showConfirmModal}
              setShowConfirmModal={setShowConfirmModal}
              isDM={isDM}
              isLoading={isLoading}
            />
          )}
        </ChatWrapper>
        {showConfirmModal && (
          <ConfirmModal
            user={{ userName: channelName }}
            type={actionType}
            onCancel={() => {
              setShowConfirmModal(false);
              setActionType(undefined);
            }}
            onOkay={() => {
              if (actionType === ACTIONS.LEAVE_GROUP) {
                leaveGroup();
              } else if (actionType === ACTIONS.MUTE_GROUP) {
                muteGroup();
              }
            }}
          />
        )}
      </Chat>
    </div>
  );
}
