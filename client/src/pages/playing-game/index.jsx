import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const PlayingGame = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    roomUniqueId,
    username,
    isPlayer1,
    gameState: initialGameState,
  } = location.state || {};
  console.log(location.state);
  const [gameState, setGameState] = useState(initialGameState || "waiting");
  const [opponentChoice, setOpponentChoice] = useState(null);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [winnerText, setWinnerText] = useState("");
  const [bothPlayersReady, setBothPlayersReady] = useState(false);
  const [score, setScore] = useState({
    player1: { wins: 0, losses: 0, draws: 0, points: 0 },
    player2: { wins: 0, losses: 0, draws: 0, points: 0 },
  });
  const [playerNames, setPlayerNames] = useState({ player1: "", player2: "" });

  useEffect(() => {
    if (!roomUniqueId || !username) {
      navigate("/");
      return;
    }

    console.log("Setting up socket listeners...");

    socket.on("playersConnected", (data) => {
      console.log("Players connected:", data);
      setGameState("playing");
      const player1Id = Object.keys(data.usernames)[0];

      const player2Id = Object.keys(data.usernames)[1];
      setPlayerNames({
        player1: data.usernames[player1Id],
        player2: data.usernames[player2Id],
      });
    });

    socket.on("p1Choice", (data) => {
      console.log("p1Choice received:", data);
      if (!isPlayer1) {
        setOpponentChoice(data.rpsValue);
        if (playerChoice) {
          setBothPlayersReady(true);
        }
      }
    });

    socket.on("p2Choice", (data) => {
      console.log("p2Choice received:", data);
      if (isPlayer1) {
        setOpponentChoice(data.rpsValue);
        if (playerChoice) {
          setBothPlayersReady(true);
        }
      }
    });

    socket.on("result", (data) => {
      console.log("Result received: ", data);
      let resultText = "";
      let newScore = { ...score };
      if (data.winner !== "draw") {
        if (
          (data.winner === "p1" && isPlayer1) ||
          (data.winner === "p2" && !isPlayer1)
        ) {
          resultText = "You win";
          newScore[isPlayer1 ? "player1" : "player2"].wins++;
          newScore[isPlayer1 ? "player1" : "player2"].points++;
          newScore[isPlayer1 ? "player2" : "player1"].losses++;
          newScore[isPlayer1 ? "player2" : "player1"].points--;
        } else {
          resultText = "You lose";
          newScore[isPlayer1 ? "player1" : "player2"].losses++;
          newScore[isPlayer1 ? "player1" : "player2"].points--;
          newScore[isPlayer1 ? "player2" : "player1"].wins++;
          newScore[isPlayer1 ? "player2" : "player1"].points++;
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
      console.log("Replay game received");
      setPlayerChoice(null);
      setOpponentChoice(null);
      setWinnerText("");
      setBothPlayersReady(false);
      setGameState("playing");
    });

    return () => {
      console.log("Cleaning up socket listeners...");
      socket.off("playersConnected");
      socket.off("p1Choice");
      socket.off("p2Choice");
      socket.off("result");
      socket.off("replayGame");
    };
  }, [roomUniqueId, username, isPlayer1, navigate, score, playerChoice]);

  useEffect(() => {
    console.log("Player Names: ", playerNames);
  }, [playerNames]);

  const sendChoice = (rpsValue) => {
    console.log("Sending choice:", rpsValue);
    const choiceEvent = isPlayer1 ? "p1Choice" : "p2Choice";
    socket.emit(choiceEvent, {
      rpsValue: rpsValue,
      roomUniqueId: roomUniqueId,
    });
    setPlayerChoice(rpsValue);
    if (opponentChoice) {
      setBothPlayersReady(true);
    }
  };

  const replayGame = () => {
    console.log("Replaying game...");
    socket.emit("replayGame", { roomUniqueId });
  };

  return (
    <div className="App bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <header className="p-6 border-4 border-headerOutline rounded-xl w-full max-w-4xl">
        <div className="flex items-center justify-between">
          <img src={logo} alt="Rock Paper Scissors" className="h-12" />
          <div className="flex space-x-4">
            <div className="w-24 p-2 bg-gray-200 rounded-lg">
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="font-semibold tracking-wide uppercase text-scoreText text-md">
                  {playerNames.player1 || "Player 1"}'s Score
                </span>
                <h3 className="text-5xl font-extrabold text-scoreText2">
                  {score.player1.points}
                </h3>
              </div>
            </div>
            <div className="w-24 p-2 bg-gray-200 rounded-lg">
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="font-semibold tracking-wide uppercase text-scoreText text-md">
                  {playerNames.player2 || "Player 2"}'s Score
                </span>
                <h3 className="text-5xl font-extrabold text-scoreText2">
                  {score.player2.points}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </header>

      {gameState === "playing" && (
        <div className="container">
          <div className="flex justify-between items-center w-full p-4">
            <div>
              You:
              <div>
                {!playerChoice ? (
                  <>
                    <button
                      className="bg-red-500 text-white px-4 py-2 m-1 rounded"
                      onClick={() => sendChoice("rock")}
                    >
                      Rock
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 m-1 rounded"
                      onClick={() => sendChoice("paper")}
                    >
                      Paper
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 m-1 rounded"
                      onClick={() => sendChoice("scissors")}
                    >
                      Scissors
                    </button>
                  </>
                ) : (
                  <button className="bg-gray-300 text-black px-4 py-2 rounded">
                    You chose: {playerChoice}
                  </button>
                )}
              </div>
            </div>
            <div>
              Opponent:
              <div>
                {opponentChoice ? (
                  <button className="bg-gray-300 text-black px-4 py-2 rounded">
                    Opponent chose: {opponentChoice}
                  </button>
                ) : (
                  <p>Waiting for opponent to choose...</p>
                )}
              </div>
            </div>
          </div>
          <hr />
          {bothPlayersReady && (
            <div className="text-2xl mt-4">
              {winnerText}
              <div>
                <button
                  className="bg-purple-500 text-white px-6 py-2 rounded mt-4"
                  onClick={replayGame}
                >
                  Replay
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayingGame;
