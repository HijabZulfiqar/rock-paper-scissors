import React, { useState, useEffect } from "react";
import rock from "../assets/images/icon-rock.svg";
import paper from "../assets/images/icon-paper.svg";
import scissors from "../assets/images/icon-scissors.svg";
import socket from "../socket";

const WinOrLose = ({
  userPicked,
  opponentPicked,
  setPlay,
  setUserSelection,
  setOpponentSelection,
  handleScore,
  setWinner,
  bothPlayersChosen,
  winnerText,
}) => {
  const [showOpponentPicked, setShowOpponentPicked] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    console.log(setShowOpponentPicked);
    if (bothPlayersChosen && opponentPicked !== "") {
      setShowOpponentPicked(true);
      setShowResult(true);
    }
  }, [bothPlayersChosen, userPicked, opponentPicked]);

  const playAgain = () => {
    setWinner("");
    setUserSelection("");
    setOpponentSelection("");
    setShowResult(false);
    setPlay(false);
    setShowOpponentPicked(false);
  };

  let left, right;
  if (userPicked === "rock") {
    left = rock;
  } else if (userPicked === "paper") {
    left = paper;
  } else {
    left = scissors;
  }

  if (opponentPicked === "rock") {
    right = rock;
  } else if (opponentPicked === "paper") {
    right = paper;
  } else {
    right = scissors;
  }

  return (
    <div className="relative left-4 min-h-[14rem] mt-32 flex flex-col gap-[5.75rem]">
      <div className="relative flex justify-between right-3">
        <div className="flex flex-col items-center gap-10">
          <img
            src={left}
            alt=""
            className={`bg-white p-6 w-24 h-24 rounded-full ring-[1rem] ring-${userPicked}Ring hover:scale-105 transition-transform`}
          />
          <span className="text-lg font-extrabold text-gray-200 uppercase">
            you picked
          </span>
        </div>
        <div className="flex flex-col items-center gap-10">
          {showOpponentPicked ? (
            <img
              src={right}
              alt=""
              className={`bg-white p-6 w-24 h-24 rounded-full ring-[1rem] ring-${opponentPicked}Ring hover:scale-105 transition-transform`}
            />
          ) : (
            <div className="bg-black/20 p-6 w-24 h-24 rounded-full hover:scale-105 transition-transform"></div>
          )}
          <span className="text-lg font-extrabold text-gray-200 uppercase">
            the opponent picked
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-10">
        {showResult && (
          <div className="absolute top-52 right-[4.1rem] flex flex-col gap-10 items-center">
            <h2 className="text-5xl font-extrabold tracking-wide text-gray-100 uppercase">
              {winnerText}
            </h2>
            <button
              className="px-12 py-3 text-2xl font-extrabold tracking-wider uppercase text-scoreText2 bg-gray-50 rounded-xl hover:opacity-80"
              onClick={playAgain}
            >
              play again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WinOrLose;
