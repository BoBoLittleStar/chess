import { combineReducers, configureStore } from "@reduxjs/toolkit";
import match from "./match";
import onlines from "./onlines";

const reducer = combineReducers({
  match,
  onlines,
});
export const store = configureStore({
  preloadedState: {
    match: "",
    onlines: 0,
  },
  reducer,
});
