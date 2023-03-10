import { AnyEvent, createForest } from "@atrilabs/forest";
import { io, Socket } from "socket.io-client";
import {
  LiveApiServerToClientEvents,
  LiveapiClientToServerEvents,
} from "../types";
import { componentStoreApi } from "./componentStoreApi";
import { componentTreeDef, forestDef } from "./forestDef";
import { createComponentFromNode } from "../utils/createComponentFromNode";

// convert events to component
function eventsToComponent(events: AnyEvent[]) {
  const forest = createForest(forestDef);
  forest.handleEvents({
    name: "events",
    events,
    meta: { agent: "server-sent" },
  });
  const nodes = forest.tree(componentTreeDef.id)!.nodes!;
  const nodeIds = Object.keys(nodes);
  nodeIds.map((nodeId) => {
    const component = createComponentFromNode(
      nodes[nodeId],
      {
        max: window.innerWidth,
        min: window.innerWidth,
      },
      forest
    )!;
    componentStoreApi.createLiveComponent(component.meta, {
      id: component.id,
      props: component.props,
      parent: component.parent,
    });
  });
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
  canvasZoneSubsrcibers[canvasZoneId].forEach((cb) => {
    try {
      cb();
    } catch (err) {
      console.log(err);
    }
  });
}

type ComponentSubsrcriberCallback = () => void;
const componentSubscribers: {
  [compId: string]: ComponentSubsrcriberCallback[];
} = {};
function subscribeComponentUpdates(
  compId: string,
  cb: ComponentSubsrcriberCallback
) {
  if (componentSubscribers[compId] === undefined) {
    componentSubscribers[compId] = [];
  }
  componentSubscribers[compId].push(cb);
  return () => {
    const foundIndex = componentSubscribers[compId].findIndex(
      (curr) => curr === cb
    );
    if (foundIndex >= 0) {
      componentSubscribers[compId].splice(foundIndex);
    }
  };
}
function callComponentUpdateSubscribers(compId: string) {
  return componentSubscribers[compId].forEach((cb) => {
    try {
      cb();
    } catch (err) {
      console.log(err);
    }
  });
}
function updateProps(id: string, selector: string[], value: any) {
  const copyOfProps = JSON.parse(
    JSON.stringify(componentStoreApi.getComponentProps(id))
  );
  let curr = copyOfProps;
  let currentIndex = 0;
  while (currentIndex < selector.length - 1) {
    if (curr[selector[currentIndex]] === undefined) {
      curr[selector[currentIndex]] = {};
    }
    curr = curr[selector[currentIndex]];
    currentIndex++;
  }
  if (curr && typeof curr === "object") {
    curr[selector[selector.length - 1]] = value;
  }
  componentStoreApi.updateProps(id, copyOfProps);
  callComponentUpdateSubscribers(id);
}

// communicate over socket to fetch events
const socket: Socket<LiveApiServerToClientEvents, LiveapiClientToServerEvents> =
  io({ path: "/_atri/socket.io", autoConnect: false });
socket.on("connect", () => {
  socket.emit("sendEvents", window.location.pathname, (incomingEvents) => {
    eventsToComponent(incomingEvents);
    const canvasZoneIds = componentStoreApi.getActiveCanvasZoneIds();
    canvasZoneIds.forEach((canvasZoneId) => {
      callCanvasZoneSubscriber(canvasZoneId);
    });
  });
});
if (
  typeof window !== "undefined" &&
  window.location === window.parent.location
) {
  socket.connect();
}

socket.on("newEvents", (urlPath, _incomingEvents) => {
  if (urlPath === window.location.pathname) {
    // Currently, we reload the page whenever there is a change in the editor
    window.location.href = window.location.href;
  }
});

export const liveApi = {
  subscribeCanvasZone,
  updateProps,
  subscribeComponentUpdates,
};
