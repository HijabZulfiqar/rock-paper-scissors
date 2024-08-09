// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "../features/gameState/gameSlice";

export const store = configureStore({
  reducer: {
    game: gameReducer,
  },
});
