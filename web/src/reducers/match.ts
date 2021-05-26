import { createAsyncThunk, createReducer } from "@reduxjs/toolkit";
import { Path } from "../config";

type StateMatch = {
  state: string;
  message?: string;
};

export const match = createAsyncThunk<string, string>(
  "match",
  async (id: string) => {
    return await fetch(Path.match, {
      method: "POST",
      body: id,
    }).then(async (response) => await response.text());
  }
);

export const selectMatch = (state: { match: StateMatch }) => state.match;

export default createReducer<StateMatch>({ state: "" }, (builder) => {
  builder
    .addCase(match.fulfilled, (state, action) => {
      state.state = action.payload;
      delete state.message;
    })
    .addCase(match.rejected, (state, action) => {
      console.log(action.error);
      state.message = action.error.message;
    });
});
