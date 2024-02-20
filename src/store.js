import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

import appSlice from "./redux/appSlice";
import accountSlice from "./redux/accountSlice";
import customizationSlice from "./redux/customizationSlice";
import searchSlice from "./redux/searchSlice";
import reportSlice from "./redux/reportSlice";
import chatSlice from "./redux/chatSlice";
import walletSlice from "./redux/walletSlice";
import notificationSlice from "./redux/notificationSlice";
import friendsSlice from "./redux/friendsSlice";
import favouriteSlice from "./redux/favouriteSlice";
import guestSlice from "./redux/guestSlice";
import worldSlice from "./redux/worldSlice";

const persistConfig = {
  key: "root",
  version: 2,
  storage,
  stateReconciler: autoMergeLevel2,
  blacklist: [
    "app.isSplashed",
    "account.agoraId",
    "notification",
    "chat",
    "world.isInWorld",
    "world.selectedWorld",
  ],
};

const rootReducer = combineReducers({
  app: appSlice,
  account: accountSlice,
  customization: customizationSlice,
  search: searchSlice,
  report: reportSlice,
  chat: chatSlice,
  wallet: walletSlice,
  notification: notificationSlice,
  friends: friendsSlice,
  favourite: favouriteSlice,
  world: worldSlice,
  guest: guestSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});
