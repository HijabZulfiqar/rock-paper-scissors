const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/healthcheck", (req, res) => {
  res.status(200).send("Server is running");
});

router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

module.exports = router;
