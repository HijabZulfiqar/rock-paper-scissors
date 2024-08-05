import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../../Layout";
import GetStarted from "../../pages/get-started/index";
import PlayingGame from "../../pages/playing-game/index";
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