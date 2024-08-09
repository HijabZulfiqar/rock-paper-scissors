import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  setGameState,
  setRoomUniqueId,
  setPlayer1,
  setUsername,
  setPlayerNames,
  socket,
} from "../../features/gameState/gameSlice";

const GetStarted = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { gameState, roomUniqueId, username } = useSelector(
    (state) => state.game
  );
  const [viewRules, setViewRules] = useState(false);

  useEffect(() => {
    socket.on("newGame", (data) => {
      dispatch(setRoomUniqueId(data.roomUniqueId));
      dispatch(setGameState("waiting"));
      dispatch(setPlayerNames({ player1: data.username, player2: "" }));
    });

    socket.on("playersConnected", (data) => {
      dispatch(setGameState("playing"));
      const player1Id = Object.keys(data.usernames)[0];
      const player2Id = Object.keys(data.usernames)[1];
      dispatch(
        setPlayerNames({
          player1: data.usernames[player1Id],
          player2: data.usernames[player2Id],
        })
      );
      navigate("/playing-game");
    });

    return () => {
      socket.off("newGame");
      socket.off("playersConnected");
    };
  }, [dispatch, navigate]);

  const showRules = () => {
    navigate("/rules");
  };

  const createGame = () => {
    if (username.trim() === "") {
      toast.error("Please enter a username to create a game.");
      return;
    }
    dispatch(setPlayer1(true));
    socket.emit("createGame", { username: username.trim() });
  };

  const joinGame = () => {
    if (username.trim() === "") {
      toast.error("Please enter a username to join a game.");
      return;
    }
    socket.emit("joinGame", { roomUniqueId, username: username.trim() });
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomUniqueId).then(
      () => toast.success("Room code copied to clipboard!"),
      (err) => toast.error("Could not copy text: " + err)
    );
  };

  return (
    <div className="bg-bgFirst bg-gradient-to-r  from-bgSecond to-bgFirst h-screen relative mx-auto">
      <div className="absolute bottom-4 left-4">
        <Button
          onClick={showRules}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Rules
        </Button>
      </div>

      <div className="flex bg-bgSecond justify-center mx-auto p-8">
        {gameState === "initial" && (
          <div className="flex">
            <Input
              type="text"
              value={roomUniqueId}
              onChange={(e) => dispatch(setRoomUniqueId(e.target.value))}
              placeholder="Enter room ID to join"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            />
            <Button
              onClick={joinGame}
              className="bg-green-950 text-white font-bold py-2 px-4 rounded"
            >
              Join Game
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center mx-auto mt-28">
        <h1 className="text-4xl font-bold mb-6 text-white ">
          Rock, Paper, Scissors Game
        </h1>
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <div className="mb-4">
            <Label className="block text-gray-700 text-sm font-bold mb-2">
              Enter your name
            </Label>
            <Input
              type="text"
              value={username}
              onChange={(e) => dispatch(setUsername(e.target.value))}
              placeholder="Enter your username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {gameState === "initial" && (
            <div>
              <Button
                onClick={createGame}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full mb-4"
              >
                Create Game
              </Button>
            </div>
          )}

          {gameState === "waiting" && (
            <div className="text-lg text-center">
              Waiting for opponent, please share code{" "}
              <span className="font-bold">{roomUniqueId}</span> to join
              <Button
                className="ml-2 bg-indigo-500 hover:bg-indigo-700 text-white px-4 py-2 rounded mt-2"
                onClick={copyRoomCode}
              >
                Copy Code
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
