import React, { useState, useEffect } from "react";

import GameView from "./GameView";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const MainView = () => {
  const [viewRules, setViewRules] = useState(false);
  const [roomUniqueId, setRoomUniqueId] = useState("");
  const [player1, setPlayer1] = useState(false);
  const [gameState, setGameState] = useState("initial");
  const [opponentChoice, setOpponentChoice] = useState(null);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [winnerText, setWinnerText] = useState("");
  const [bothPlayersReady, setBothPlayersReady] = useState(false);
  const [score, setScore] = useState({
    player1: { wins: 0, losses: 0, draws: 0, points: 0 },
    player2: { wins: 0, losses: 0, draws: 0, points: 0 },
  });
  const [username, setUsername] = useState("");
  const [playerNames, setPlayerNames] = useState({ player1: "", player2: "" });

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
    });

    socket.on("p1Choice", (data) => {
      if (!player1) {
        setOpponentChoice(data.rpsValue);
      }
    });

    socket.on("p2Choice", (data) => {
      if (player1) {
        setOpponentChoice(data.rpsValue);
      }
    });

    socket.on("result", (data) => {
      let resultText = "";
      let newScore = { ...score };
      if (data.winner !== "draw") {
        if (
          (data.winner === "p1" && player1) ||
          (data.winner === "p2" && !player1)
        ) {
          resultText = "You win";
          newScore[player1 ? "player1" : "player2"].wins++;
          newScore[player1 ? "player1" : "player2"].points++;
          newScore[player1 ? "player2" : "player1"].losses++;
          newScore[player1 ? "player2" : "player1"].points--;
        } else {
          resultText = "You lose";
          newScore[player1 ? "player1" : "player2"].losses++;
          newScore[player1 ? "player1" : "player2"].points--;
          newScore[player1 ? "player2" : "player1"].wins++;
          newScore[player1 ? "player2" : "player1"].points++;
        }
      } else {
        resultText = "It's a draw";
        newScore.player1.draws++;
        newScore.player2.draws++;
      }
      setWinnerText(resultText);
      setScore(newScore);
      setBothPlayersReady(true);
    });

    socket.on("replayGame", () => {
      setPlayerChoice(null);
      setOpponentChoice(null);
      setWinnerText("");
      setBothPlayersReady(false);
      setGameState("playing");
    });

    return () => {
      socket.off("newGame");
      socket.off("playersConnected");
      socket.off("p1Choice");
      socket.off("p2Choice");
      socket.off("result");
      socket.off("replayGame");
    };
  }, [player1, score]);

  const showRules = () => {
    setViewRules(!viewRules);
  };

  const createGame = () => {
    if (username.trim() === "") {
      alert("Please enter a username to create a game.");
      return;
    }
    setPlayer1(true);
    socket.emit("createGame", { username: username.trim() });
  };

  const joinGame = () => {
    if (username.trim() === "") {
      alert("Please enter a username to join a game.");
      return;
    }
    socket.emit("joinGame", { roomUniqueId, username: username.trim() });
  };

  const sendChoice = (rpsValue) => {
    const choiceEvent = player1 ? "p1Choice" : "p2Choice";
    socket.emit(choiceEvent, {
      rpsValue: rpsValue,
      roomUniqueId: roomUniqueId,
    });
    setPlayerChoice(rpsValue);
  };

  const replayGame = () => {
    socket.emit("replayGame", { roomUniqueId });
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomUniqueId).then(
      () => console.log("Copying to clipboard was successful!"),
      (err) => console.error("Could not copy text: ", err)
    );
  };

  return (
    <GameView
      showRules={showRules}
      roomUniqueId={roomUniqueId}
      username={username}
      player1={player1}
      gameState={gameState}
      opponentChoice={opponentChoice}
      playerChoice={playerChoice}
      winnerText={winnerText}
      bothPlayersReady={bothPlayersReady}
      score={score}
      setRoomUniqueId={setRoomUniqueId}
      setPlayer1={setPlayer1}
      setUsername={setUsername}
      createGame={createGame}
      joinGame={joinGame}
      sendChoice={sendChoice}
      replayGame={replayGame}
      copyRoomCode={copyRoomCode}
      playerNames={playerNames}
    />
  );
};

export default MainView;
