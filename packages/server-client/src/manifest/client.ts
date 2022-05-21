import ReactRuntime from "react/jsx-runtime";
import React from "react";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./types";
import {} from "@atrilabs/core";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env["ATRI_TOOL_MANIFEST_SERVER_CLIENT"] as string
);

function registerComponents(scriptName: string) {
  //do stuff with the script
  const handle = (window as any)[scriptName];
  console.log("loaded", handle.setup);
  handle.setup(
    (registry: { [manifestId: string]: { components: any[] } }) => {
      console.log("registry received", registry);
    },
    React,
    ReactRuntime
  );
}

socket.emit("sendManifestScripts", (bundles) => {
  console.log("received bundles", bundles);
  bundles.forEach((bundle) => {
    const scriptName = bundle.scriptName;
    const script = document.createElement("script");
    script.innerHTML = bundle.src;
    document.body.appendChild(script);
    registerComponents(scriptName);
  });
});
