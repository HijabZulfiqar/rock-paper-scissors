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
import logo from "../../assets/images/logo.svg";

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
    <div className="bg-bgFirst bg-gradient-to-r from-bgSecond to-bgFirst h-screen relative mx-auto">
      <header className="flex justify-start p-4 bg-[#184e77]">
        <img src={logo} alt="Logo" className="h-16" />{" "}
      </header>

      <div className="absolute bottom-4 left-4">
        {/* <Button
          onClick={showRules}
          className="bg-[#184e77] text-white font-bold py-2 px-4 rounded"
        >
          Rules
        </Button> */}
        <Button
          onClick={showRules}
          className="flex bg-[#184e77] text-white gap-2 items-center group px-10"
        >
          <span>Rules</span>
          <span className="group-hover:translate-x-[-2px] transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-chevrons-left"
            >
              <path d="m11 17-5-5 5-5" />
              <path d="m18 17-5-5 5-5" />
            </svg>
          </span>
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center mx-auto mt-28">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <div className="mb-4">
            <Label className="block text-gray-700 text-sm font-bold mb-2">
              Enter your name
            </Label>
            <Input
              type="text"
              value={username}
              onChange={(e) => {
                const newUsername = e.target.value;
                if (newUsername.length <= 7) {
                  dispatch(setUsername(newUsername));
                } else {
                  toast.error("Username should not be greater than 7 letters.");
                }
              }}
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
          <div className="flex items-center my-4">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-gray-500">or</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>
          {gameState === "initial" && (
            <div className="mb-4">
              <Label className="block text-gray-700 text-sm font-bold mb-2">
                Enter Room ID to Join
              </Label>
              <div className="flex">
                <Input
                  type="text"
                  value={roomUniqueId}
                  onChange={(e) => dispatch(setRoomUniqueId(e.target.value))}
                  placeholder="Enter room ID"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                />
                <Button
                  onClick={joinGame}
                  className="bg-green-950 text-white font-bold py-2 px-4 rounded"
                >
                  Join Game
                </Button>
              </div>
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
