import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "report",
  initialState: {
    harassment: false,
    suspicious: false,
    abusive: false,
    llegal: false,
    solicting: false,
    isReportOpen: false,
    isReportSubmited: false,
    showReportModal: false,
    accused: undefined ,
    onSuccess: undefined
  },
  reducers: {
    setIsHarassment: (state, action) => {
      state.harassment = action.payload;
    },
    setIsSuspicious: (state, action) => {
      state.suspicious = action.payload;
    },
    setIsAbusive: (state, action) => {
      state.abusive = action.payload;
    },
    setIsIllegal: (state, action) => {
      state.illegal = action.payload;
    },
    setIsSolicting: (state, action) => {
      state.solicting = action.payload;
    },
    setIsReportOpen: (state, action) => {
      state.isReportOpen = action.payload;
    },
    setIsReportSubmited: (state, action) => {
      state.isReportSubmited = action.payload;
    },
    setShowReportUserModal: (state, action) => {
      state.showReportModal = action.payload
    },
    setAccused: (state, action) => {
      state.accused = action.payload
    },
    setOnSuccess: (state, action) => {
      state.onSuccess= action.payload
    }
  },
});
export const {
  setIsHarassment,
  setIsSuspicious,
  setIsAbusive,
  setIsIllegal,
  setIsSolicting,
  setIsReportOpen,
  setIsReportSubmited,
  setShowReportUserModal,
  setAccused,
  setOnSuccess
} = counterSlice.actions;
export default counterSlice.reducer;
