import { io } from "socket.io-client";

const URL = "http://localhost:3000";
const socket = io(URL, {
  autoConnect: false,
});

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

export default socket;
