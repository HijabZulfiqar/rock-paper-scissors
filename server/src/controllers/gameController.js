const {
  getRoom,
  resetChoices,
  saveGameResult,
} = require("../services/roomService");

const Game = require("../models/Game");

function declareWinner(roomUniqueId, io) {
  const room = getRoom(roomUniqueId);
  const p1Choice = room.p1Choice;
  const p2Choice = room.p2Choice;
  let winner = null;

  if (p1Choice === p2Choice) {
    winner = "draw";
  } else if (
    (p1Choice === "Paper" && p2Choice === "Scissors") ||
    (p1Choice === "Rock" && p2Choice === "Paper") ||
    (p1Choice === "Scissors" && p2Choice === "Rock")
  ) {
    winner = "p2";
  } else {
    winner = "p1";
  }

  io.to(roomUniqueId).emit("result", { winner });

  const player1 = Object.values(room.usernames)[0];
  const player2 = Object.values(room.usernames)[1];
  saveGameResult(
    player1,
    player2,
    winner === "draw" ? "draw" : winner === "p1" ? player1 : player2
  );

  resetChoices(roomUniqueId);
}

function checkForWinner(roomUniqueId, io) {
  const room = getRoom(roomUniqueId);
  if (room.p1Choice && room.p2Choice) {
    declareWinner(roomUniqueId, io);
  }
}

async function storeGameResult(player1, player2, winner) {
  const game = new Game({ player1, player2, winner });
  return await game.save();
}

async function getGames() {
  return await Game.find({});
}

module.exports = {
  declareWinner,
  checkForWinner,
  storeGameResult,
  getGames,
};
