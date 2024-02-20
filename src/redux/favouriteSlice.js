import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: 'favourite',
  initialState: {
    updateFavouriteList: new Date().getTime()
  },
  reducers: {
    setUpdateFavouriteList: (state, action) => {
      state.updateFavouriteList = action.payload
    },
  }
})

export const {
  setUpdateFavouriteList
} = counterSlice.actions

export default counterSlice.reducer