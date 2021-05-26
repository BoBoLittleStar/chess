import { combineReducers, configureStore } from "@reduxjs/toolkit";
import match from "./match";
import refresh from "./refresh";

const reducer = combineReducers({
  refresh,
  match,
});
export const store = configureStore({
  preloadedState: {
    refresh: {
      state: 0,
    },
    match: {
      state: "",
    },
  },
  reducer,
});
