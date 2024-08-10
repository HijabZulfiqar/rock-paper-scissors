const Room = require("../models/Room");

const GameResult = require("../models/Game");
const rooms = {};

function saveGameResult(player1, player2, winner) {
  const newGameResult = new GameResult({
    player1,
    player2,
    winner,
  });
  return newGameResult.save();
}

function createRoom(roomId) {
  rooms[roomId] = new Room();
}

function getRoom(roomId) {
  return rooms[roomId];
}

function addUserToRoom(roomId, userId, username) {
  rooms[roomId].usernames[userId] = username;
}

function removeUserFromRoom(roomId, userId) {
  delete rooms[roomId].usernames[userId];
}

function setPlayerChoice(roomId, player, choice) {
  if (!rooms[roomId]) {
    throw new Error(`Room with ID ${roomId} does not exist.`);
  }
  rooms[roomId][`${player}Choice`] = choice;
}

function resetChoices(roomId) {
  rooms[roomId].p1Choice = null;
  rooms[roomId].p2Choice = null;
}

module.exports = {
  createRoom,
  getRoom,
  addUserToRoom,
  removeUserFromRoom,
  setPlayerChoice,
  resetChoices,
  saveGameResult,
};
