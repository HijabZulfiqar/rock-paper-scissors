const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const PORT = 3000;
const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("/healthcheck", (req, res) => {
  res.status(200).send("Server is running");
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("A user connected with ID: " + socket.id);

  socket.on("createGame", (data) => {
    const roomUniqueId = makeid(6);
    rooms[roomUniqueId] = {
      players: {},
      p1Choice: null,
      p2Choice: null,
      usernames: {},
    };
    rooms[roomUniqueId].usernames[socket.id] = data.username;
    socket.join(roomUniqueId);
    console.log(data.username + " created a game with ID: " + roomUniqueId);
    socket.emit("newGame", {
      roomUniqueId: roomUniqueId,
      username: data.username,
    });
  });

  socket.on("joinGame", (data) => {
    if (rooms[data.roomUniqueId]) {
      rooms[data.roomUniqueId].usernames[socket.id] = data.username;
      socket.join(data.roomUniqueId);
      console.log(
        data.username + " joined the game with ID: " + data.roomUniqueId
      );
      io.to(data.roomUniqueId).emit("playersConnected", {
        usernames: rooms[data.roomUniqueId].usernames,
      });
    } else {
      socket.emit("error", { message: "Room does not exist." });
    }
  });

  socket.on("p1Choice", (data) => {
    rooms[data.roomUniqueId].p1Choice = data.rpsValue;
    io.to(data.roomUniqueId).emit("p1Choice", { rpsValue: data.rpsValue });
    checkForWinner(data.roomUniqueId);
  });

  socket.on("p2Choice", (data) => {
    rooms[data.roomUniqueId].p2Choice = data.rpsValue;
    io.to(data.roomUniqueId).emit("p2Choice", { rpsValue: data.rpsValue });
    checkForWinner(data.roomUniqueId);
  });

  socket.on("replayGame", (data) => {
    io.to(data.roomUniqueId).emit("replayGame");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

function declareWinner(roomUniqueId) {
  let p1Choice = rooms[roomUniqueId].p1Choice;
  let p2Choice = rooms[roomUniqueId].p2Choice;
  let winner = null;
  if (p1Choice === p2Choice) {
    winner = "draw";
  } else if (
    (p1Choice == "Paper" && p2Choice == "Scissor") ||
    (p1Choice == "Rock" && p2Choice == "Paper") ||
    (p1Choice == "Scissor" && p2Choice == "Rock")
  ) {
    winner = "p2";
  } else {
    winner = "p1";
  }
  io.to(roomUniqueId).emit("result", { winner: winner });
  rooms[roomUniqueId].p1Choice = null;
  rooms[roomUniqueId].p2Choice = null;
}

function checkForWinner(roomUniqueId) {
  if (rooms[roomUniqueId].p1Choice && rooms[roomUniqueId].p2Choice) {
    declareWinner(roomUniqueId);
  }
}

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
