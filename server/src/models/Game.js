const mongoose = require("mongoose");

const gameResultSchema = new mongoose.Schema({
  player1: String,
  player2: String,
  winner: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const GameResult = mongoose.model("GameResult", gameResultSchema);

module.exports = GameResult;
