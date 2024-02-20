import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "customization",
  initialState: {
    ringColor: "red",
    primaryColor: "yellow",
    secondaryColor: "green",
    items: [],
  },
  reducers: {
    setCustomizationItems: (state, action) => {
      state.items = action.payload;
    },
    setRingColor: (state, action) => {
      state.ringColor = action.payload;
    },
    setPrimaryColor: (state, action) => {
      state.primaryColor = action.payload;
    },
    setSecondaryColor: (state, action) => {
      state.secondaryColor = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setRingColor,
  setCustomizationItems,
  setPrimaryColor,
  setSecondaryColor,
} = counterSlice.actions;

export default counterSlice.reducer;
