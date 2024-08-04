const path = require("path");
const express = require("express");
const { app, server, io } = require("./src/config/server");
const routes = require("./src/routes");
const handleSocket = require("./src/socket/socketHandler");

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "./client/dist")));
app.use(routes);

handleSocket(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
