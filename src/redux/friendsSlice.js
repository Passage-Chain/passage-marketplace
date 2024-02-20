import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "friends",
  initialState: {
    friends: null,
    updateFriendList: new Date().getTime(),
    maxView: false
  },
  reducers: {
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    setUpdateFriendList: (state, action) => {
      state.updateFriendList = action.payload
    },
    setMaxView: (state, action) => {
      state.maxView = action.payload
    }
  },
});

// Action creators are generated for each case reducer function
export const { setUpdateFriendList, setMaxView } = counterSlice.actions;

export default counterSlice.reducer;
