import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";

export type Chess =
  | "ROOK"
  | "KNIGHT"
  | "BISHOP"
  | "GUARD"
  | "SOLDIER"
  | "KING"
  | "CANNON";
type TypeGame = {
  redId: string;
  blackId: string;
  player: string;
  reds: { [p: number]: Chess };
  blacks: { [p: number]: Chess };
  moves: number[];
};

export type TypeState = {
  onlineCount?: number;
  matchedOpponent?: string;
  opponentStatus?: "ready" | "left";
  currentGame?: TypeGame;
};

type TypeData = Omit<TypeState, "currentGame"> & {
  currentGame?: string;
};

const initialState: TypeState = {
  onlineCount: 0,
};

export const receiveData = createAction("receiveData", (data: TypeData) => {
  const currentGame =
    data.currentGame && (JSON.parse(data.currentGame) as TypeGame);
  return {
    payload: {
      ...data,
      currentGame,
    },
  };
});
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
        if (currentGame) {
          state.currentGame = currentGame;
        }
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
