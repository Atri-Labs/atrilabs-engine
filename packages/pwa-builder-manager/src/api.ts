import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "@atrilabs/core";
import { editorAppMachineInterpreter, subscribeEditorMachine } from "./init";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

socket.on("connect", () => {
  socket.emit("getProjectInfo", (info) => {
    editorAppMachineInterpreter.send({ type: "PROJECT_INFO_FETCHED", info });
  });
  socket.emit("getAppInfo", (info) => {
    editorAppMachineInterpreter.send({ type: "APP_INFO_FETCHED", info });
  });
  socket.emit("getPagesInfo", (info) => {
    editorAppMachineInterpreter.send({ type: "PAGES_INFO_FETCHED", info });
  });
});

window.addEventListener("message", (ev) => {
  if (
    ev.origin === editorAppMachineInterpreter.machine.context.appInfo?.hostname
  ) {
    if (ev.data === "ready") {
      editorAppMachineInterpreter.send({ type: "CANVAS_IFRAME_LOADED" });
    }
  }
});

subscribeEditorMachine("before_app_load", (context) => {
  // fetch only if not already fetched
  if (context.events[context.currentUrlPath] === undefined) {
    socket.emit("fetchEvents", context.currentUrlPath, (events) => {
      editorAppMachineInterpreter.send({
        type: "PAGE_EVENTS_FETCHED",
        events,
        urlPath: context.currentUrlPath,
      });
    });
  }
});
