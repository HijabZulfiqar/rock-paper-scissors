import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export const sendChoice = createAsyncThunk(
  "sendChoice",
  async ({ rpsValue, roomUniqueId, player1 }, { dispatch }) => {
    const choiceEvent = player1 ? "p1Choice" : "p2Choice";
    socket.emit(choiceEvent, {
      rpsValue: rpsValue,
      roomUniqueId: roomUniqueId,
    });
    dispatch(setPlayerChoice(rpsValue));
  }
);

export const replayGame = createAsyncThunk(
  "replayGame",
  async ({ roomUniqueId }, { dispatch }) => {
    socket.emit("replayGame", { roomUniqueId });
    dispatch(resetGame());
  }
);

const initialState = {
  gameState: "initial",
  roomUniqueId: "",
  player1: false,
  opponentChoice: null,
  playerChoice: null,
  winnerText: "",
  bothPlayersReady: false,
  score: {
    player1: { wins: 0, losses: 0, draws: 0, points: 0 },
    player2: { wins: 0, losses: 0, draws: 0, points: 0 },
  },
  username: "",
  playerNames: { player1: "", player2: "" },
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameState(state, action) {
      state.gameState = action.payload;
    },
    setRoomUniqueId(state, action) {
      state.roomUniqueId = action.payload;
    },
    setPlayer1(state, action) {
      state.player1 = action.payload;
    },
    setOpponentChoice(state, action) {
      state.opponentChoice = action.payload;
    },
    setPlayerChoice(state, action) {
      state.playerChoice = action.payload;
    },
    setWinnerText(state, action) {
      state.winnerText = action.payload;
    },
    setBothPlayersReady(state, action) {
      state.bothPlayersReady = action.payload;
    },
    setScore(state, action) {
      state.score = action.payload;
    },
    setUsername(state, action) {
      state.username = action.payload;
    },
    setPlayerNames(state, action) {
      state.playerNames = action.payload;
    },
    resetGame(state) {
      state.opponentChoice = null;
      state.playerChoice = null;
      state.winnerText = "";
      state.bothPlayersReady = false;
      state.gameState = "playing";
    },
  },
});

export const {
  setGameState,
  setRoomUniqueId,
  setPlayer1,
  setOpponentChoice,
  setPlayerChoice,
  setWinnerText,
  setBothPlayersReady,
  setScore,
  setUsername,
  setPlayerNames,
  resetGame,
} = gameSlice.actions;

export { socket };
export default gameSlice.reducer;
