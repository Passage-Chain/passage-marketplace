import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    showChatWindow: false,
    activeChannel: null,
    client: null,
    showMemberList: false,
    updateTimestamp: new Date().getTime(),
    onlineUsers: [],
    chatUserId: undefined,
    chatMessage: '',
    isDM: false,
    dmTimestamp: new Date().getTime(),
    unreadCount: 0,
    chatType: ''
  },
  reducers: {
    setShowChatWindow: (state, action) => {
      state.showChatWindow = action.payload
    },
    setDmTimestamp: (state, action) => {
      state.dmTimestamp = action.payload
    },
    setChatUserId: (state, action) => {
      state.chatUserId = action.payload
    },
    setChatMessage: (state, action) => {
      state.chatMessage = action.payload
    },
    setIsDM: (state, action) => {
      state.isDM = action.payload
    },
    setActiveChannel: (state, action) => {
      state.activeChannel = action.payload;
    },
    setClient: (state, action) => {
      state.client = action.payload
    },
    setViewMemberList: (state, action) => {
      state.showMemberList = action.payload
    },
    setUpdateTimestamp: (state, action) => {
      state.updateTimestamp = action.payload
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload
    },
    setChatType: (state, action) => {
      state.chatType = action.payload
    },
    clean: (state) => {
      state.activeChannel = null;
      state.unreadCount = 0
    }
  },
});

// Action creators are generated for each case reducer function
export const {
  setActiveChannel,
  setClient,
  setViewMemberList,
  setUpdateTimestamp,
  setOnlineUsers,
  setShowChatWindow,
  setChatUserId,
  setChatMessage,
  setIsDM,
  setDmTimestamp,
  setUnreadCount,
  setChatType
} = chatSlice.actions;

export default chatSlice.reducer;
