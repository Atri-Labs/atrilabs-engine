import { canvasMachineInterpreter, subscribeCanvasMachine } from "./init";
import { componentStoreApi } from "./componentStoreApi";
import { CANVAS_ZONE_ROOT_ID } from "./consts";
import { CanvasZoneEvent, ComponentEvent } from "../types";
import {
  getComponentIndexInsideCanvasZone,
  getComponentIndexInsideParentComponent,
} from "./utils";

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

subscribeCanvasMachine("reposition", (context) => {
  console.log("Reposition atri-app-core: ", context.repositionTarget);
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

const componentEventSubscribers: {
  [key in ComponentEvent]: { [compId: string]: (() => void)[] };
} = {
  new_component: {},
};
const canvasZoneEventSubscribers: {
  [key in CanvasZoneEvent]: { [canvasZoneId: string]: (() => void)[] };
} = { new_component: {} };
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
      const payload = ev.data.payload as {
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
      componentStoreApi.createComponent(payload.meta, {
        id: payload.id,
        props: payload.props,
        parent: payload.parent,
      });
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
  window.addEventListener(
    "mouseover",
    (ev) => {
      canvasMachineInterpreter.send({
        type: "MOUSE_OVER",
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
    () => {
      canvasMachineInterpreter.send({
        type: "BLUR",
      });
    },
    true
  );

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
