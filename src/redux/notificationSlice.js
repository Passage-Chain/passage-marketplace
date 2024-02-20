import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
  name: "friends",
  initialState: {
    notifications: [],
    visibility: false
  },
  reducers: {
    setNotification: (state, action) => {
      state.notifications = [action.payload, ...state.notifications];
    },
    remove: (state, action) => {
      const index = action.payload
      state.notifications = state.notifications.filter((el, i) => i !== index)
    },
    truncate: (state, action) => {
      state.notifications = []
      state.type = ''
    },
    setVisibility: (state, action) => {
      state.visibility = action.payload

    }
  },
});

export const { setNotification, remove, truncate, setVisibility } = notificationSlice.actions;

export default notificationSlice.reducer;
