import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: 'world',
  initialState: {
    _id: null,
    worldData: null,
    isInWorld: false,
    selectedWorld: null
  },
  reducers: {
    setWorldData: (state, action) => {
      state.worldData = action.payload
    },
    setIsInWorld: (state, action) => {
      state.isInWorld = action.payload
    },
    setSelectedWorld: (state, action) => {
      state.selectedWorld = action.payload
    }
  }
})

export const {
  setWorldData,
  setIsInWorld,
  setSelectedWorld
} = counterSlice.actions

export default counterSlice.reducer
