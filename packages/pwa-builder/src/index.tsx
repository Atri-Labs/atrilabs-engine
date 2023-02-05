import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { editorAppMachineInterpreter } from "@atrilabs/pwa-builder-manager";

editorAppMachineInterpreter.start();

const root = document.getElementById("root")!;
const rootel = ReactDOM.createRoot(root);
rootel.render(<App />);
