import { AnyEvent, createForest, Forest } from "@atrilabs/forest";
import { io, Socket } from "socket.io-client";
import {
  LiveApiServerToClientEvents,
  LiveapiClientToServerEvents,
} from "../types";
import { componentStoreApi } from "./componentStoreApi";
import { callbackTreeDef, componentTreeDef, forestDef } from "./forestDef";
import { createComponentFromNode } from "../utils/createComponentFromNode";
import { mergeState } from "../utils/mergeState";

let activeForest: Forest | null = null;

// convert events to component
function eventsToComponent(events: AnyEvent[]) {
  const forest = createForest(forestDef);
  forest.handleEvents({
    name: "events",
    events,
    meta: { agent: "server-sent" },
  });
  activeForest = forest;
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
      alias: getComponentAlias(component.id),
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

function emitSendEvents() {
  socket.emit("sendEvents", getActivePageRoute(), (incomingEvents) => {
    eventsToComponent(incomingEvents);
    const state = getPageState();
    const urlPath = getActivePageRoute();
    const query = getQuery();
    socket.emit("runSSG", { urlPath, state }, (delta) => {
      const aliases = Object.keys(delta);
      aliases.forEach((alias) => {
        const compId = getComponentIdFromAlias(alias);
        if (compId) mergeProps(compId, delta[alias], true);
      });
      socket.emit("runSSR", { urlPath, state, query }, (delta) => {
        const aliases = Object.keys(delta);
        aliases.forEach((alias) => {
          const compId = getComponentIdFromAlias(alias);
          if (compId) mergeProps(compId, delta[alias], true);
        });
        const canvasZoneIds = componentStoreApi.getActiveCanvasZoneIds();
        canvasZoneIds.forEach((canvasZoneId) => {
          callCanvasZoneSubscriber(canvasZoneId);
        });
      });
    });
  });
}

socket.on("connect", () => {
  emitSendEvents();
});

if (
  typeof window !== "undefined" &&
  window.location === window.parent.location
) {
  socket.connect();
}

socket.on("newEvents", (urlPath, _incomingEvents) => {
  if (urlPath === getActivePageRoute()) {
    // Currently, we reload the page whenever there is a change in the editor
    window.location.href = window.location.href;
  }
});

function getActivePageRoute() {
  // TODO: Get route from atri router instead
  return window.location.pathname;
}

function getQuery() {
  return window.location.search;
}

function getComponentAlias(compId: string): string {
  return activeForest?.tree(componentTreeDef.id)?.nodes[compId].state.alias;
}

function getComponentCallbackHandlers(compId: string) {
  const callbackTree = activeForest?.tree(callbackTreeDef.id);
  if (callbackTree) {
    const callbackNodeId = callbackTree.links[compId].childId;
    if (callbackNodeId) {
      return callbackTree.nodes[callbackNodeId].state.property?.callbacks;
    }
  }
}

/**
 * state of the page that should be sent to the backend
 */
function getPageState() {
  const compIds = componentStoreApi.getAllComponentIds();
  const pageState = compIds.reduce((prev, curr) => {
    const alias = getComponentAlias(curr);
    prev[alias] = componentStoreApi.getComponentProps(curr);
    delete prev[alias]["styles"];
    return prev;
  }, {} as { [alias: string]: any });
  return pageState;
}

function getComponentIdFromAlias(alias: string) {
  const nodes = activeForest?.tree(componentTreeDef.id)!.nodes;
  if (nodes) {
    const nodeIds = Object.keys(nodes);
    return nodeIds.find(
      (nodeId) => nodes[nodeId].state.alias === alias && alias !== undefined
    );
  }
}

function mergeProps(
  id: string,
  propsDelta: any,
  doNotCallUpdateSubscribers?: boolean
) {
  const props = JSON.parse(
    JSON.stringify(componentStoreApi.getComponentProps(id))
  );
  mergeState(props, propsDelta);
  componentStoreApi.updateProps(id, props);
  if (doNotCallUpdateSubscribers !== true) {
    callComponentUpdateSubscribers(id);
  }
}

/**
 * The reset function is used when the user
 * moves from one page to another
 */
function reset() {
  componentStoreApi.reset();
  activeForest = null;
  emitSendEvents();
}

export const liveApi = {
  subscribeCanvasZone,
  updateProps,
  subscribeComponentUpdates,
  getActivePageRoute,
  getQuery,
  getComponentAlias,
  getComponentCallbackHandlers,
  getPageState,
  getComponentIdFromAlias,
  mergeProps,
  reset,
};
