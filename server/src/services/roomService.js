const Room = require("../models/Room");

const rooms = {};

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
};
