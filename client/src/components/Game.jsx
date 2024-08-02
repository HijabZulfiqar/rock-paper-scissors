import React, { useState, useEffect } from "react";
import GameStart from "./GameStart";
import WinOrLose from "./WinorLose";
import socket from "../socket";

const Game = ({
  roomUniqueId,
  username,
  isPlayer1,
  manageScore,
  setWinner,
}) => {
  const [play, setPlay] = useState(false);
  const [userSelection, setUserSelection] = useState("");
  const [opponentSelection, setOpponentSelection] = useState("");
  const [bothPlayersChosen, setBothPlayersChosen] = useState(false);
  const [winnerText, setWinnerText] = useState("");

  useEffect(() => {
    socket.emit(isPlayer1 ? "createGame" : "joinGame", {
      roomUniqueId,
      username,
    });

    socket.on("playersConnected", () => {
      setPlay(true);
    });

    socket.on("choice", (data) => {
      if (
        (data.player === "p1" && !isPlayer1) ||
        (data.player === "p2" && isPlayer1)
      ) {
        setOpponentSelection(data.rpsValue);
        if (userSelection !== "") {
          setBothPlayersChosen(true);
        }
      }
    });

    socket.on("result", (data) => {
      setWinner(data.winner);
      manageScore(data.winner);
      setWinnerText(data.winnerText);
      setBothPlayersChosen(true);
    });

    return () => {
      socket.off("playersConnected");
      socket.off("choice");
      socket.off("result");
    };
  }, [
    roomUniqueId,
    username,
    isPlayer1,
    manageScore,
    setWinner,
    userSelection,
  ]);

  useEffect(() => {
    if (userSelection && opponentSelection) {
      const determineWinner = (user, opponent) => {
        if (user === opponent) {
          return "draw";
        }
        if (
          (user === "rock" && opponent === "scissors") ||
          (user === "scissors" && opponent === "paper") ||
          (user === "paper" && opponent === "rock")
        ) {
          return "user";
        } else {
          return "opponent";
        }
      };

      const result = determineWinner(userSelection, opponentSelection);
      const winnerText =
        result === "draw"
          ? "It's a draw"
          : result === "user"
          ? "You win"
          : "You lose";
      socket.emit("result", { winner: result, roomUniqueId, winnerText });
    }
  }, [userSelection, opponentSelection, roomUniqueId]);

  return play ? (
    <WinOrLose
      setPlay={setPlay}
      setUserSelection={setUserSelection}
      setOpponentSelection={setOpponentSelection}
      userPicked={userSelection}
      opponentPicked={opponentSelection}
      handleScore={manageScore}
      setWinner={setWinner}
      bothPlayersChosen={bothPlayersChosen}
      winnerText={winnerText}
    />
  ) : (
    <GameStart
      setPlay={setPlay}
      setUserSelection={setUserSelection}
      roomUniqueId={roomUniqueId}
      isPlayer1={isPlayer1}
    />
  );
};

export default Game;
