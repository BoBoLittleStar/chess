import { createAction, createReducer } from "@reduxjs/toolkit";

export const onlines = createAction("onlines", (count: number) => {
  return { payload: count };
});

export const selectOnlines = (state: { onlines: number }) => state.onlines;

export default createReducer<number>(0, (builder) => {
  builder.addCase(onlines, (state, action) => {
    return action.payload;
  });
});
