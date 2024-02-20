import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "search",
  initialState: {
    isSearch: false,
    searchItem: [],
    searchText: null,
    isUserFind: null,
  },
  reducers: {
    setIsSearch: (state, action) => {
      state.isSearch = action.payload;
    },
    setSearchItem: (state, action) => {
      state.searchItem = action.payload;
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    setIsUserFind: (state, action) => {
      state.isUserFind = action.payload;
    },
  },
});
export const { setIsSearch, setSearchItem, setSearchText, setIsUserFind } =
  counterSlice.actions;
export default counterSlice.reducer;
