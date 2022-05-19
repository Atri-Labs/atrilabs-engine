import ReactRuntime from "react/jsx-runtime";
import React from "react";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./types";
import {} from "@atrilabs/core";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env["ATRI_TOOL_MANIFEST_SERVER_CLIENT"] as string
);

socket.emit("sendManifestScripts", (bundles) => {
  bundles.forEach((bundle) => {
    const scriptName = bundle.scriptName;
    const script = document.createElement("script");
    const handle = (window as any)[scriptName];
    script.onload = function () {
      //do stuff with the script
      console.log("loaded", handle.setup);
      handle.setup(
        (registry: { [manifestId: string]: { components: any[] } }) => {
          console.log("registry received", registry);
        },
        React,
        ReactRuntime
      );
    };
    script.innerHTML = bundle.src;
    document.head.appendChild(script);
  });
});
