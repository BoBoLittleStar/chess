import { createAsyncThunk, createReducer } from "@reduxjs/toolkit";
import { Path } from "../config";

type StateRefresh = {
  state: number;
  message?: string;
};

export const refresh = createAsyncThunk<number, string>(
  "refresh",
  async (id: string) => {
    return await fetch(Path.refresh, {
      method: "PUT",
      body: id,
    }).then(async (response) => await response.json());
  }
);

export const selectRefresh = (state: { refresh: StateRefresh }) =>
  state.refresh;

export default createReducer<StateRefresh>({ state: 0 }, (builder) => {
  builder
    .addCase(refresh.fulfilled, (state, action) => {
      state.state = action.payload;
      delete state.message;
    })
    .addCase(refresh.rejected, (state, action) => {
      state.message = action.error.message;
    });
});
