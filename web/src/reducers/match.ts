import { createAction, createReducer } from "@reduxjs/toolkit";

export const match = createAction("match", (id: string) => {
  return { payload: id };
});

export const selectMatch = (state: { match: string }) => state.match;

export default createReducer<string>("", (builder) => {
  builder.addCase(match, (state, action) => {
    return action.payload;
  });
});
