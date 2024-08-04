const { getRoom, resetChoices } = require("../services/roomService");

function declareWinner(roomUniqueId, io) {
  const room = getRoom(roomUniqueId);
  let p1Choice = room.p1Choice;
  let p2Choice = room.p2Choice;
  let winner = null;

  if (p1Choice === p2Choice) {
    winner = "draw";
  } else if (
    (p1Choice === "Paper" && p2Choice === "Scissor") ||
    (p1Choice === "Rock" && p2Choice === "Paper") ||
    (p1Choice === "Scissor" && p2Choice === "Rock")
  ) {
    winner = "p2";
  } else {
    winner = "p1";
  }

  io.to(roomUniqueId).emit("result", { winner: winner });
  resetChoices(roomUniqueId);
}

function checkForWinner(roomUniqueId, io) {
  const room = getRoom(roomUniqueId);
  if (room.p1Choice && room.p2Choice) {
    declareWinner(roomUniqueId, io);
  }
}

module.exports = { declareWinner, checkForWinner };
