import React from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const rootEl = document.getElementById("root");

hydrateRoot(
  rootEl,
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
