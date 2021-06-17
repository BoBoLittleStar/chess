import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";

export enum Chess {
  "ROOK",
  "KNIGHT",
  "BISHOP",
  "GUARD",
  "SOLDIER",
  "KING",
  "CANNON",
}
export type TypeState = {
  onlineCount?: number;
  matchedOpponent?: string;
  opponentStatus?: "ready" | "left";
  currentGame?: {
    redId: string;
    blackId: string;
    red: { [p: number]: Chess };
    black: { [p: number]: Chess };
    moves: number[];
  };
};

type TypeData = Omit<TypeState, "currentGame"> & {
  currentGame?: string;
};

const initialState: TypeState = {
  onlineCount: 0,
};

export const receiveData = createAction("receiveData", (data: TypeData) => ({
  payload: data,
}));
export const resetMatch = createAction("resetMatch");

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(
      receiveData,
      (
        state,
        {
          payload: {
            onlineCount,
            matchedOpponent,
            opponentStatus,
            currentGame,
          },
        }
      ) => {
        onlineCount && (state.onlineCount = onlineCount);
        matchedOpponent &&
          (state.matchedOpponent =
            matchedOpponent !== "null" ? matchedOpponent : undefined);
        opponentStatus && (state.opponentStatus = opponentStatus);
        currentGame && (state.currentGame = JSON.parse(currentGame));
      }
    )
    .addCase(resetMatch, (state) => {
      state.matchedOpponent = undefined;
      state.opponentStatus = undefined;
    });
});

export const store = configureStore({
  preloadedState: initialState,
  reducer,
});
