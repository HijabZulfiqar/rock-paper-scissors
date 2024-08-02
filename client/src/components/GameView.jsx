import React from "react";
import logo from "../assets/images/logo.svg";

const GameView = ({
  roomUniqueId,
  username,
  player1,
  gameState,
  opponentChoice,
  playerChoice,
  winnerText,
  bothPlayersReady,
  score,
  setRoomUniqueId,
  setUsername,
  createGame,
  joinGame,
  sendChoice,
  replayGame,
  copyRoomCode,
  playerNames,
}) => {
  return (
    <div className="App bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <header className="p-6 border-4 border-headerOutline rounded-xl w-full max-w-4xl">
        <div className="flex items-center justify-between">
          <img src={logo} alt="Rock Paper Scissors" className="h-12" />
          {gameState === "playing" && (
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
          )}
        </div>
      </header>

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

      {gameState === "initial" && (
        <div>
          <button onClick={createGame}>Create Game</button>
          <input
            type="text"
            value={roomUniqueId}
            onChange={(e) => setRoomUniqueId(e.target.value)}
            placeholder="Enter room ID to join"
          />
          <button onClick={joinGame}>Join Game</button>
        </div>
      )}

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
                      onClick={() => sendChoice("Rock")}
                    >
                      Rock
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 m-1 rounded"
                      onClick={() => sendChoice("Paper")}
                    >
                      Paper
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 m-1 rounded"
                      onClick={() => sendChoice("Scissors")}
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
                {bothPlayersReady ? (
                  <button className="bg-gray-300 text-black px-4 py-2 rounded">
                    Opponent chose: {opponentChoice}
                  </button>
                ) : (
                  <>
                    {!opponentChoice ? (
                      <p>Waiting for opponent to choose...</p>
                    ) : (
                      <p>Opponent has made a choice</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <hr />
          {bothPlayersReady && (
            <div className="text-2xl mt-4">{winnerText}</div>
          )}
          {winnerText && (
            <button
              className="bg-purple-500 text-white px-6 py-2 rounded mt-4"
              onClick={replayGame}
            >
              Replay
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default GameView;
