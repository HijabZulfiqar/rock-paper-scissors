const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const corsOptions = require("./cors");

const app = express();
app.use(cors(corsOptions));

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

module.exports = { app, server, io };
