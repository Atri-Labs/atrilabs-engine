import { AnyEvent, createForest } from "@atrilabs/forest";
import { io, Socket } from "socket.io-client";
import {
  LiveApiServerToClientEvents,
  LiveapiClientToServerEvents,
} from "../types";
import { forestDef } from "./forestDef";

let events: AnyEvent[] = [];

// communicate over socket to fetch events
const socket: Socket<LiveApiServerToClientEvents, LiveapiClientToServerEvents> =
  io({ path: "/_atri/socket.io" });
socket.on("connect", () => {
  console.log("socket connected");
  socket.emit("sendEvents", window.location.pathname, (incomingEvents) => {
    events = incomingEvents;
  });
});
socket.connect();
socket.on("newEvents", (urlPath, incomingEvents) => {
  if (urlPath === window.location.pathname) {
    events = incomingEvents;
  }
});

// create forest
function eventsToComponent(events: AnyEvent[]) {
  const forest = createForest(forestDef);
}

// call subscriber of each canvas zone
type CanvasZoneSubscribeCallback = () => void;
const canvasZoneSubsrcibers: {
  [canvasZoneId: string]: CanvasZoneSubscribeCallback[];
} = {};
function subscribeCanvasZone(
  canvasZoneId: string,
  cb: CanvasZoneSubscribeCallback
) {
  if (canvasZoneSubsrcibers[canvasZoneId] === undefined)
    canvasZoneSubsrcibers[canvasZoneId] = [];
  canvasZoneSubsrcibers[canvasZoneId].push(cb);
  return () => {
    const foundIndex = canvasZoneSubsrcibers[canvasZoneId].findIndex(
      (curr) => curr === cb
    );
    if (foundIndex >= 0) {
      canvasZoneSubsrcibers[canvasZoneId].splice(foundIndex, 1);
    }
  };
}
function callCanvasZoneSubscriber(canvasZoneId: string) {
  canvasZoneSubsrcibers[canvasZoneId].forEach((cb) => cb());
}

export const liveApi = {
  subscribeCanvasZone,
};
