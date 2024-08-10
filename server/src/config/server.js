const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./db");
const { storeGameResult, getGames } = require("../controllers/gameController");
const corsOptions = require("./cors");

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

connectDB();

app.post("/api/games", (req, res) => {
  const { player1_name, player2_name, winner } = req.body;
  storeGameResult(player1_name, player2_name, winner)
    .then((game) => res.status(201).send(game))
    .catch((err) => res.status(500).send(err));
});

app.get("/api/games", (req, res) => {
  getGames()
    .then((games) => res.status(200).send(games))
    .catch((err) => res.status(500).send(err));
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("joinGame", ({ username, room }) => {
    socket.join(room);
    console.log(`${username} joined room ${room}`);
  });
});

if (!module.parent) {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = { app, server, io };
