import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const rootEl = document.getElementById("root");

ReactDOM.hydrate(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  rootEl
);
