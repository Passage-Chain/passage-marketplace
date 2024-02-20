import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: 'wallet',
  initialState: {
    address: null,
    nftConnected: false
  },
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload
    },
    setNftConnected: (state, action) => {
      state.nftConnected = action.payload
    }
  }
})

export const {
  setAddress,
  setNftConnected
} = counterSlice.actions

export default counterSlice.reducer