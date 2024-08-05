import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const GetStarted = () => {
  const [username, setUsername] = useState("");
  const [roomUniqueId, setRoomUniqueId] = useState("");
  const [isPlayer1, setIsPlayer1] = useState(false);
  const [gameState, setGameState] = useState("initial");
  const [opponentChoice, setOpponentChoice] = useState(null);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [winnerText, setWinnerText] = useState("");
  const [bothPlayersReady, setBothPlayersReady] = useState(false);
  const [score, setScore] = useState({
    player1: { wins: 0, losses: 0, draws: 0, points: 0 },
    player2: { wins: 0, losses: 0, draws: 0, points: 0 },
  });
  const [playerNames, setPlayerNames] = useState({ player1: "", player2: "" });
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("newGame", (data) => {
      setRoomUniqueId(data.roomUniqueId);
      setGameState("waiting");
      setPlayerNames({ player1: data.username, player2: "" });
    });

    socket.on("playersConnected", (data) => {
      setGameState("playing");
      const player1Id = Object.keys(data.usernames)[0];
      const player2Id = Object.keys(data.usernames)[1];
      setPlayerNames({
        player1: data.usernames[player1Id],
        player2: data.usernames[player2Id],
      });
      navigate("/playing-game", {
        state: {
          roomUniqueId,
          username,
          isPlayer1,
          gameState: "playing",
        },
      });
    });

    socket.on("p1Choice", (data) => {
      if (!isPlayer1) {
        setOpponentChoice(data.rpsValue);
      }
    });

    socket.on("p2Choice", (data) => {
      if (isPlayer1) {
        setOpponentChoice(data.rpsValue);
      }
    });

    return () => {
      socket.off("newGame");
      socket.off("playersConnected");
      socket.off("p1Choice");
      socket.off("p2Choice");
      socket.off("result");
      socket.off("replayGame");
    };
  }, [isPlayer1, score, navigate, roomUniqueId, username]);

  const createGame = () => {
    if (username.trim() === "") {
      alert("Please enter a username to create a game.");
      return;
    }
    setIsPlayer1(true);
    socket.emit("createGame", { username: username.trim() });
  };

  const joinGame = () => {
    if (username.trim() === "") {
      alert("Please enter a username to join a game.");
      return;
    }
    socket.emit("joinGame", { roomUniqueId, username: username.trim() });
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomUniqueId).then(
      () => console.log("Copying to clipboard was successful!"),
      (err) => console.error("Could not copy text: ", err)
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold underline py-4">
        Welcome to Rock, Paper, Scissors game
      </h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
        className="input"
      />
      <button onClick={createGame} className="create-btn">
        Create Game
      </button>
      <input
        type="text"
        value={roomUniqueId}
        onChange={(e) => setRoomUniqueId(e.target.value)}
        placeholder="Enter room ID to join"
        className="input"
      />
      <button onClick={joinGame} className="join-btn">
        Join Game
      </button>
      {gameState === "waiting" && (
        <div className="text-lg">
          Waiting for opponent, please share code {roomUniqueId} to join
          <button
            className="ml-2 bg-indigo-500 text-white px-4 py-2 rounded"
            onClick={copyRoomCode}
          >
            Copy Code
          </button>
        </div>
      )}
    </div>
  );
};

export default GetStarted;
