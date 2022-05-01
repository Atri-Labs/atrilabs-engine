import React from "react";
import { createRoot } from "react-dom/client";
import { subscribeSetApp } from "./setApp";

const container = document.getElementById("root");
const root = createRoot(container!);

subscribeSetApp((App) => {
  root.render(App);
});
