import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../../Layout";
import GetStarted from "../../pages/get-started/index";
import PlayingGame from "../../pages/playing-game/index";
import Rules from "../../pages/rules/index";
import GameRecord from "../../pages/game-record/index"; // Import the GameRecord component
import NotFound from "../../pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "get-started",
        element: <GetStarted />,
      },
      {
        path: "playing-game",
        element: <PlayingGame />,
      },
      {
        path: "rules",
        element: <Rules />,
      },
      {
        path: "game-record",
        element: <GameRecord />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
