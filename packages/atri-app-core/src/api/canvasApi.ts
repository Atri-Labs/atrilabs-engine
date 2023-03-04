import { canvasMachineInterpreter, subscribeCanvasMachine } from "./init";
import { componentStoreApi } from "./componentStoreApi";
import { CANVAS_ZONE_ROOT_ID } from "./consts";
import { CanvasZoneEvent, ComponentEvent, ImportedResource } from "../types";
import {
  getComponentIndexInsideCanvasZone,
  getComponentIndexInsideParentComponent,
} from "./utils";
import type { DewireUpdate, RewireUpdate } from "@atrilabs/forest";
import { handleResources } from "./handleResources";
import { handlePasteEvents } from "./handlePasteEvents";

type ComponentPayload = {
  id: string;
  props: {
    [key: string]: any;
  };
  parent: {
    id: string;
    index: number;
    canvasZoneId: string;
  };
  acceptsChild: boolean;
  callbacks: {
    [key: string]: any[];
  };
  meta: { key: string; pkg: string; manifestSchemaId: string };
};

canvasMachineInterpreter.start();

subscribeCanvasMachine("ready", () => {
  window.parent.postMessage({ type: "ready" }, "*");
});
subscribeCanvasMachine("INSIDE_CANVAS", (_context, event) => {
  window.parent.postMessage(
    {
      type: "INSIDE_CANVAS",
      event: {
        canvasPageX: (event as any).event.pageX,
        canvasPageY: (event as any).event.pageY,
      },
    },
    "*"
  );
});
subscribeCanvasMachine("INSIDE_CANVAS", (_context, event) => {
  window.parent.postMessage(
    {
      type: "OUTSIDE_CANVAS",
      event: {
        canvasPageX: (event as any).event.pageX,
        canvasPageY: (event as any).event.pageY,
      },
    },
    "*"
  );
});
subscribeCanvasMachine("moveWhileDrag", () => {
  // TODO: detect catcher & call canvas overlay api
});
subscribeCanvasMachine("upWhileDrag", (context) => {
  const canvasZone = (context.mousePosition!.target as HTMLElement).closest(
    "[data-atri-canvas-id]"
  );
  const parentEl = (context.mousePosition!.target as HTMLElement).closest(
    "[data-atri-parent]"
  );
  if (canvasZone) {
    let id = CANVAS_ZONE_ROOT_ID;
    if (parentEl) {
      id = parentEl.getAttribute("data-atri-comp-id")!;
    }
    window.parent.postMessage(
      {
        type: "DRAG_SUCCESS",
        parent: {
          id: id,
          index:
            id === CANVAS_ZONE_ROOT_ID
              ? getComponentIndexInsideCanvasZone(
                  canvasZone.getAttribute("data-atri-canvas-id")!,
                  context.mousePosition!
                )
              : getComponentIndexInsideParentComponent(
                  id,
                  context.mousePosition!
                ),
          canvasZoneId: canvasZone.getAttribute("data-atri-canvas-id"),
        },
      },
      "*"
    );
  } else {
    window.parent.postMessage(
      {
        type: "DRAG_FAILED",
      },
      "*"
    );
  }
});
subscribeCanvasMachine("repositionSuccess", (context) => {
  const canvasZone = (context.repositionTarget!.target as HTMLElement).closest(
    "[data-atri-canvas-id]"
  );
  const parentEl = (context.repositionTarget!.target as HTMLElement).closest(
    "[data-atri-parent]"
  );
  if (canvasZone) {
    let id = CANVAS_ZONE_ROOT_ID;
    if (parentEl) {
      id = parentEl.getAttribute("data-atri-comp-id")!;
    }
    window.parent.postMessage(
      {
        type: "REDROP_SUCCESSFUL",
        parent: {
          id: id,
          index:
            id === CANVAS_ZONE_ROOT_ID
              ? getComponentIndexInsideCanvasZone(
                  canvasZone.getAttribute("data-atri-canvas-id")!,
                  context.repositionTarget!
                )
              : getComponentIndexInsideParentComponent(
                  id,
                  context.repositionTarget!
                ),
          canvasZoneId: canvasZone.getAttribute("data-atri-canvas-id"),
        },
        repositionComponent: context.repositionComponent,
      },
      "*"
    );
  } else {
    window.parent.postMessage(
      {
        type: "REDROP_FAILED",
      },
      "*"
    );
  }
});
subscribeCanvasMachine("select", (context) => {
  window.parent?.postMessage({ type: "select", id: context.selected }, "*");
});
subscribeCanvasMachine("selectEnd", (context) => {
  window.parent?.postMessage({ type: "selectEnd", id: context.selected }, "*");
});
function stringifyEvent(e: KeyboardEvent) {
  const obj = {};
  for (let k in e) {
    // @ts-ignore
    obj[k] = e[k];
  }
  return JSON.stringify(
    obj,
    (k, v) => {
      if (v instanceof Node) return "Node";
      if (v instanceof Window) return "Window";
      return v;
    },
    " "
  );
}
subscribeCanvasMachine("KEY_DOWN", (context, event) => {
  if (event.type === "KEY_DOWN") {
    const keyEvent = event.event;
    window.parent?.postMessage(
      {
        type: "KEY_DOWN",
        context: { selected: context.selected, hovered: context.hovered },
        event: JSON.parse(stringifyEvent(keyEvent)),
      },
      "*"
    );
  }
});
subscribeCanvasMachine("KEY_UP", (context, event) => {
  if (event.type === "KEY_UP") {
    const keyEvent = event.event;
    window.parent?.postMessage(
      {
        type: "KEY_UP",
        context: { selected: context.selected, hovered: context.hovered },
        event: JSON.parse(stringifyEvent(keyEvent)),
      },
      "*"
    );
  }
});

const componentEventSubscribers: {
  [key in ComponentEvent]: { [compId: string]: (() => void)[] };
} = {
  new_component: {},
  props_updated: {},
  children_updated: {},
};
const canvasZoneEventSubscribers: {
  [key in CanvasZoneEvent]: { [canvasZoneId: string]: (() => void)[] };
} = { new_component: {}, children_updated: {} };
subscribeCanvasMachine("COMPONENT_CREATED", (_context, event) => {
  if (event.type === "COMPONENT_CREATED") {
    const { parentId, canvasZoneId } = event;
    if (parentId === CANVAS_ZONE_ROOT_ID) {
      canvasZoneEventSubscribers.new_component[canvasZoneId]?.forEach((cb) =>
        cb()
      );
    } else {
      componentEventSubscribers.new_component[parentId]?.forEach((cb) => cb());
    }
  }
});
subscribeCanvasMachine("COMPONENT_DELETED", (_context, event) => {
  if (event.type === "COMPONENT_DELETED") {
    const comp = event.comp;
    if (comp.parent.id === CANVAS_ZONE_ROOT_ID) {
      canvasZoneEventSubscribers.children_updated[
        comp.parent.canvasZoneId
      ]?.forEach((cb) => cb());
    } else {
      componentEventSubscribers.children_updated[comp.parent.id]?.forEach(
        (cb) => cb()
      );
    }
  }
});
subscribeCanvasMachine("COMPONENT_REWIRED", (_context, event) => {
  if (event.type === "COMPONENT_REWIRED") {
    const { oldParent, newParent } = event;
    if (oldParent.id === CANVAS_ZONE_ROOT_ID) {
      canvasZoneEventSubscribers.children_updated[
        oldParent.canvasZoneId
      ]?.forEach((cb) => cb());
    } else {
      componentEventSubscribers.children_updated[oldParent.id]?.forEach((cb) =>
        cb()
      );
    }
    if (newParent.id === CANVAS_ZONE_ROOT_ID) {
      canvasZoneEventSubscribers.children_updated[
        newParent.canvasZoneId
      ]?.forEach((cb) => cb());
    } else {
      componentEventSubscribers.children_updated[newParent.id]?.forEach((cb) =>
        cb()
      );
    }
  }
});
subscribeCanvasMachine("PROPS_UPDATED", (_context, event) => {
  if (event.type === "PROPS_UPDATED") {
    componentEventSubscribers.props_updated[event.compId]?.forEach((cb) =>
      cb()
    );
  }
});
function subscribeCanvasZoneEvent(
  canvasZoneId: string,
  event: CanvasZoneEvent,
  cb: () => void
) {
  canvasZoneEventSubscribers[event][canvasZoneId] =
    canvasZoneEventSubscribers[event][canvasZoneId] ?? [];
  canvasZoneEventSubscribers[event][canvasZoneId].push(cb);
  return () => {
    const foundIndex = canvasZoneEventSubscribers[event][
      canvasZoneId
    ].findIndex((curr) => {
      return curr === cb;
    });
    if (foundIndex >= 0) {
      canvasZoneEventSubscribers[event][canvasZoneId].splice(foundIndex, 1);
    }
  };
}
function subscribeComponentEvent(
  compId: string,
  event: ComponentEvent,
  cb: () => void
) {
  componentEventSubscribers[event][compId] =
    componentEventSubscribers[event][compId] ?? [];
  componentEventSubscribers[event][compId].push(cb);
  return () => {
    const foundIndex = componentEventSubscribers[event][compId].findIndex(
      (curr) => {
        return curr === cb;
      }
    );
    if (foundIndex >= 0) {
      componentEventSubscribers[event][compId].splice(foundIndex, 1);
    }
  };
}

if (typeof window !== "undefined") {
  window.addEventListener("message", (ev) => {
    if (ev.data?.type === "drag_in_progress") {
      canvasMachineInterpreter.send({
        type: "_DRAG_IN_PROGRESS",
        dragComp: ev.data.dragComp,
        dragData: ev.data.dragData,
      });
    }
    if (ev.data?.type === "drag_stopped") {
      canvasMachineInterpreter.send({
        type: "_DRAG_STOPPED",
      });
    }
    if (ev.data?.type === "CREATE_COMPONENT") {
      const payload = ev.data.payload as ComponentPayload;
      componentStoreApi.createComponent(payload.meta, {
        id: payload.id,
        props: payload.props,
        parent: payload.parent,
      });
    }
    if (ev.data?.type === "UPDATE_PROPS") {
      const payload = ev.data.payload as ComponentPayload;
      componentStoreApi.updateProps(payload.id, payload.props);
    }
    if (ev.data?.type === "DELETE_COMPONENT") {
      const payload = ev.data.payload as DewireUpdate;
      componentStoreApi.deleteComponent(payload.childId);
    }
    if (ev.data?.type === "REWIRE_COMPONENT") {
      const payload = ev.data.payload as RewireUpdate;
      const newParent = payload.newParent as any;
      componentStoreApi.rewireComponent(payload.compId, newParent);
    }
    if (ev.data?.type === "PROGRAMTIC_HOVER") {
      canvasMachineInterpreter.send({
        type: "PROGRAMTIC_HOVER",
        id: ev.data.id,
      });
    }
    if (ev.data?.type === "PROGRAMTIC_SELECT") {
      window.blur();
      canvasMachineInterpreter.send({
        type: "PROGRAMTIC_SELECT",
        id: ev.data.id,
      });
    }
    if (ev.data?.type === "IMPORT_RESOURCES" && ev.data?.resources) {
      const resources = ev.data.resources as ImportedResource[];
      handleResources(resources);
    }
    if (ev.data?.type === "atri-paste-events") {
      handlePasteEvents(ev.data);
    }
  });
  window.document.addEventListener(
    "mouseenter",
    (ev) => {
      canvasMachineInterpreter.send({
        type: "INSIDE_CANVAS",
        event: { pageX: ev.pageX, pageY: ev.pageY },
      });
    },
    true
  );
  window.document.addEventListener(
    "mouseleave",
    (ev) => {
      canvasMachineInterpreter.send({
        type: "OUTSIDE_CANVAS",
        event: { pageX: ev.pageX, pageY: ev.pageY },
      });
    },
    true
  );
  window.addEventListener(
    "mousemove",
    (ev) => {
      canvasMachineInterpreter.send({
        type: "MOUSE_MOVE",
        event: { pageX: ev.pageX, pageY: ev.pageY, target: ev.target },
      });
    },
    true
  );
  window.addEventListener(
    "mouseup",
    (ev) => {
      canvasMachineInterpreter.send({
        type: "MOUSE_UP",
        event: { pageX: ev.pageX, pageY: ev.pageY, target: ev.target },
      });
    },
    true
  );
  window.addEventListener(
    "mousedown",
    (ev) => {
      canvasMachineInterpreter.send({
        type: "MOUSE_DOWN",
        event: { pageX: ev.pageX, pageY: ev.pageY, target: ev.target },
      });
    },
    true
  );
  window.addEventListener("scroll", () => {
    canvasMachineInterpreter.send({ type: "SCROLL" });
  });
  window.addEventListener(
    "blur",
    (ev) => {
      if (
        ev.relatedTarget !== null &&
        ev.relatedTarget !== undefined &&
        "getAttribute" in ev.relatedTarget
      ) {
        const value = (ev.relatedTarget as HTMLElement).getAttribute(
          "data-atri-comp-id"
        );
        if (value === undefined) {
          canvasMachineInterpreter.send({
            type: "BLUR",
          });
        }
      } else {
        canvasMachineInterpreter.send({
          type: "BLUR",
        });
      }
    },
    true
  );
  window.addEventListener("keydown", (event) => {
    canvasMachineInterpreter.send({ type: "KEY_DOWN", event });
  });
  window.addEventListener("keyup", (event) => {
    canvasMachineInterpreter.send({ type: "KEY_UP", event });
  });

  if (window.location !== window.parent.location) {
    canvasMachineInterpreter.send({ type: "IFRAME_DETECTED" });
  } else {
    canvasMachineInterpreter.send({ type: "TOP_WINDOW_DETECTED" });
  }
  window.addEventListener("load", () => {
    canvasMachineInterpreter.send({ type: "WINDOW_LOADED" });
  });
}

export const canvasApi = {
  subscribeCanvasZoneEvent,
  subscribeComponentEvent,
};
