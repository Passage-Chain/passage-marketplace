import { createSlice } from "@reduxjs/toolkit";

export const feedSlice = createSlice({
  name: "feed",
  initialState: {
    id: null,
  
  },
  reducers: {
    setId: (state, action) => {
      state.id = action.payload;
    },
    
  },
});

// Action creators are generated for each case reducer function
export const {
  setToken,

} = counterSlice.actions;

export default counterSlice.reducer;
