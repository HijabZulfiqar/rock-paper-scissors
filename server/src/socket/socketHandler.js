const {
  createRoom,
  getRoom,
  addUserToRoom,
  setPlayerChoice,
} = require("../services/roomService");
const { checkForWinner } = require("../controllers/gameController");
const generateId = require("../utils/generateId");

function handleSocket(io) {
  io.on("connection", (socket) => {
    console.log("A user connected with ID: " + socket.id);

    socket.on("createGame", (data) => {
      const roomUniqueId = generateId(6);
      createRoom(roomUniqueId);
      addUserToRoom(roomUniqueId, socket.id, data.username);
      socket.join(roomUniqueId);
      console.log(data.username + " created a game with ID: " + roomUniqueId);
      socket.emit("newGame", {
        roomUniqueId: roomUniqueId,
        username: data.username,
      });
    });

    socket.on("joinGame", (data) => {
      const room = getRoom(data.roomUniqueId);
      if (room) {
        addUserToRoom(data.roomUniqueId, socket.id, data.username);
        socket.join(data.roomUniqueId);
        console.log(
          data.username + " joined the game with ID: " + data.roomUniqueId
        );
        io.to(data.roomUniqueId).emit("playersConnected", {
          usernames: room.usernames,
        });
      } else {
        socket.emit("error", { message: "Room does not exist." });
      }
    });

    socket.on("p1Choice", (data) => {
      setPlayerChoice(data.roomUniqueId, "p1", data.rpsValue);
      io.to(data.roomUniqueId).emit("p1Choice", { rpsValue: data.rpsValue });
      checkForWinner(data.roomUniqueId, io);
    });

    socket.on("p2Choice", (data) => {
      setPlayerChoice(data.roomUniqueId, "p2", data.rpsValue);
      io.to(data.roomUniqueId).emit("p2Choice", { rpsValue: data.rpsValue });
      checkForWinner(data.roomUniqueId, io);
    });

    socket.on("replayGame", (data) => {
      io.to(data.roomUniqueId).emit("replayGame");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected: " + socket.id);
    });
  });
}

module.exports = handleSocket;
