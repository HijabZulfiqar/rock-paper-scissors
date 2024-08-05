import React from "react";
import ReactDOM from "react-dom/client";
import "./global.css";
import Router from "./services/router/Router";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
