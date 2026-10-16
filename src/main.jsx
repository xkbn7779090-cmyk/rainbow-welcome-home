import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./Experience.jsx";
import "./horizon.css";
import "./materials.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
