import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import logo from "../../assets/images/logo.svg";
import paper from "../../assets/images/icon-paper.svg";
import rock from "../../assets/images/icon-rock.svg";
import scissors from "../../assets/images/icon-scissors.svg";
import triangle from "../../assets/images/bg-triangle.svg";
import {
  setOpponentChoice,
  setWinnerText,
  setScore,
  setBothPlayersReady,
  resetGame,
  sendChoice,
  replayGame,
  socket,
} from "../../features/gameState/gameSlice";
import { Repeat, X } from "lucide-react";

const PlayingGame = () => {
  const [replayMatchCounter, setReplayMatchCounter] = useState(6);
  const dispatch = useDispatch();
  const {
    gameState,
    opponentChoice,
    playerChoice,
    winnerText,
    bothPlayersReady,
    score,
    playerNames,
    player1,
    roomUniqueId,
  } = useSelector((state) => state.game);

  useEffect(() => {
    const handleP1Choice = (data) => {
      if (!player1) {
        dispatch(setOpponentChoice(data.rpsValue));
      }
    };

    const handleP2Choice = (data) => {
      if (player1) {
        dispatch(setOpponentChoice(data.rpsValue));
      }
    };

    const handleResult = (data) => {
      let resultText = "";
      let newScore = {
        player1: { ...score.player1 },
        player2: { ...score.player2 },
      };

      if (data.winner !== "draw") {
        if ((data.winner === "p1" && player1) || (data.winner === "p2" && !player1)) {
          resultText = "You win 🥇";
          newScore[player1 ? "player1" : "player2"].wins++;
          newScore[player1 ? "player1" : "player2"].points++;
          newScore[player1 ? "player2" : "player1"].losses++;
          newScore[player1 ? "player2" : "player1"].points--;
        } else {
          resultText = "You lose 💔";
          newScore[player1 ? "player1" : "player2"].losses++;
          newScore[player1 ? "player1" : "player2"].points--;
          newScore[player1 ? "player2" : "player1"].wins++;
          newScore[player1 ? "player2" : "player1"].points++;
        }
      } else {
        resultText = "It's a draw 😧";
        newScore.player1.draws++;
        newScore.player2.draws++;
      }

      dispatch(setWinnerText(resultText));
      dispatch(setScore(newScore));
      dispatch(setBothPlayersReady(true));
    };

    const handleReplayGame = () => {
      dispatch(resetGame());
    };

    socket.on("p1Choice", handleP1Choice);
    socket.on("p2Choice", handleP2Choice);
    socket.on("result", handleResult);
    socket.on("replayGame", handleReplayGame);

    return () => {
      socket.off("p1Choice", handleP1Choice);
      socket.off("p2Choice", handleP2Choice);
      socket.off("result", handleResult);
      socket.off("replayGame", handleReplayGame);
    };
  }, [dispatch, player1, score]);

  const handleSendChoice = (rpsValue) => {
    dispatch(sendChoice({ rpsValue, roomUniqueId, player1 }));
  };

  const handleReplayGame = () => {
    dispatch(replayGame({ roomUniqueId }));
  };

  if (gameState === "playing") {
    return (
      <div className="bg-bgFirst bg-gradient-to-r from-bgSecond to-bgFirst min-h-screen mx-auto flex flex-col justify-between">
        <div className="flex justify-center ">
          <header className="p-6 border-4 border-headerOutline rounded-xl w-full mt-3 max-w-4xl">
            <div className="flex items-center justify-between">
              <img src={logo} alt="Rock Paper Scissors" className="h-12" />
              {gameState === "playing" && (
                <div className="flex space-x-4">
                  <div className="w-24 p-2 bg-gray-200 rounded-lg">
                    <div className="flex flex-col items-center justify-center gap-1 text-center">
                      <span className="font-semibold tracking-wide uppercase text-scoreText text-md">
                        {playerNames.player1 || "Player 1"}'s Score
                      </span>
                      <h3 className="text-5xl font-extrabold text-scoreText2">{score.player1.points}</h3>
                    </div>
                  </div>
                  <div className="w-24 p-2 bg-gray-200 rounded-lg">
                    <div className="flex flex-col items-center justify-center gap-1 text-center">
                      <span className="font-semibold tracking-wide uppercase text-scoreText text-md">
                        {playerNames.player2 || "Player 2"}'s Score
                      </span>
                      <h3 className="text-5xl font-extrabold text-scoreText2">{score.player2.points}</h3>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </header>
        </div>

        <div className="flex flex-col items-center justify-center flex-grow -mt-24">
          {!playerChoice ? (
            <div className="flex justify-center relative min-h-[14rem]">
              <img src={triangle} alt="Triangle Layout" className="h-80" />
              <button
                className="absolute  bottom-64 left-0 right-32  bg-white p-6 w-24 h-24 rounded-full ring-[1rem] ring-paperRing hover:scale-110 transition-transform"
                onClick={() => handleSendChoice("Paper")}
              >
                <img src={paper} alt="Paper" />
              </button>
              <button
                className="absolute top-56 right-[66%] left-[34.7%] bg-white p-6 w-24 h-24 rounded-full ring-[1rem] ring-rockRing hover:scale-110 transition-transform"
                onClick={() => handleSendChoice("Rock")}
              >
                <img src={rock} alt="Rock" />
              </button>
              <button
                className="absolute bottom-64 right-0 bg-white p-6 w-24 h-24 rounded-full ring-[1rem] ring-scissorsRing hover:scale-110 transition-transform"
                onClick={() => handleSendChoice("Scissors")}
              >
                <img src={scissors} alt="Scissors" />
              </button>
            </div>
          ) : bothPlayersReady ? (
            <>
              <div className="flex justify-center items-center mt-24 space-x-8">
                <div className="flex justify-between gap-20">
                  <div>
                    {playerChoice === "Paper" && (
                      <button className="bg-white p-6 w-24 h-24 rounded-full ring-[1rem] ring-paperRing" disabled>
                        <img src={paper} alt="Paper" />
                      </button>
                    )}
                    {playerChoice === "Rock" && (
                      <button className="bg-white p-6 w-24 h-24 rounded-full ring-[1rem] ring-rockRing" disabled>
                        <img src={rock} alt="Rock" />
                      </button>
                    )}
                    {playerChoice === "Scissors" && (
                      <button className="bg-white p-6 w-24 h-24 rounded-full ring-[1rem] ring-scissorsRing" disabled>
                        <img src={scissors} alt="Scissors" />
                      </button>
                    )}
                  </div>
                  <div>
                    {opponentChoice === "Paper" && (
                      <button className="bg-white p-6 w-24 h-24 rounded-full ring-[1rem] ring-paperRing" disabled>
                        <img src={paper} alt="Paper" />
                      </button>
                    )}
                    {opponentChoice === "Rock" && (
                      <button className="bg-white p-6 w-24 h-24 rounded-full ring-[1rem] ring-rockRing" disabled>
                        <img src={rock} alt="Rock" />
                      </button>
                    )}
                    {opponentChoice === "Scissors" && (
                      <button className="bg-white p-6 w-24 h-24 rounded-full ring-[1rem] ring-scissorsRing" disabled>
                        <img src={scissors} alt="Scissors" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {bothPlayersReady && winnerText && (
                <div className="text-4xl text-center mt-16 text-white">{winnerText}</div>
              )}
              {winnerText && (
                <div className="flex justify-center mb-4 text-white mt-16">
                  <button className="bg-purple-500 text-white px-6 py-2 rounded flex gap-3" onClick={handleReplayGame}>
                    <Repeat />
                    <span>Rematch</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex justify-center items-center mt-24 space-x-8">
                <div className="flex justify-between gap-20">
                  <div>
                    {playerChoice === "Paper" && (
                      <button className="bg-white p-6 w-24 h-24 rounded-full ring-[1rem] ring-paperRing" disabled>
                        <img src={paper} alt="Paper" />
                      </button>
                    )}
                    {playerChoice === "Rock" && (
                      <button className="bg-white p-6 w-24 h-24 rounded-full ring-[1rem] ring-rockRing" disabled>
                        <img src={rock} alt="Rock" />
                      </button>
                    )}
                    {playerChoice === "Scissors" && (
                      <button className="bg-white p-6 w-24 h-24 rounded-full ring-[1rem] ring-scissorsRing" disabled>
                        <img src={scissors} alt="Scissors" />
                      </button>
                    )}
                  </div>
                  <div>
                    <button
                      className="bg-gray-400 p-6 w-24 h-24 rounded-full ring-[1rem] ring-gray-500"
                      disabled
                    ></button>
                  </div>
                </div>
              </div>
              <p className="text-3xl mt-16 text-white">Waiting for opponent to choose...</p>
            </>
          )}
        </div>
        <button onClick={() => window.location.href = "/get-started"} className="absolute bottom-8 left-[50%] text-white">
          <X className="transition-all hover:scale-110" />
        </button>
      </div>
    );
  }
};

export default PlayingGame;
