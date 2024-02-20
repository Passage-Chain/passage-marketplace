import { createSlice } from "@reduxjs/toolkit";

export const guestUserSlice = createSlice({
  name: "guestUser",
  initialState: {
    walletAddress: null,
  },
  reducers: {
    setWalletAddress: (state, action) => {
      state.walletAddress = action.payload;
    },
  },
});

export const { setWalletAddress } = guestUserSlice.actions;

export default guestUserSlice.reducer;