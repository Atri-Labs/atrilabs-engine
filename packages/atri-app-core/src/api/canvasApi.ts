import { canvasMachineInterpreter, subscribeCanvasMachine } from "./init";
import { manifestRegistryController } from "@atrilabs/manifest-registry";
import { componentStoreApi } from "./componentStoreApi";
import { CANVAS_ZONE_ROOT_ID } from "./consts";
import { CanvasZoneEvent, ComponentEvent } from "../types";

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
  // TODO: detect catcher & send failed or success
  if (context.mousePosition?.target) {
    const canvasZone = (context.mousePosition.target as HTMLElement).closest(
      "[data-canvas-id]"
    );
    if (canvasZone && context.dragData) {
      const registry = manifestRegistryController.readManifestRegistry();
      const fullManifest = registry[
        context.dragData.data.manifestSchema
      ].manifests.find((curr) => {
        return (
          curr.pkg === context.dragData?.data.pkg &&
          curr.manifest.meta.key === context.dragData?.data.key
        );
      });
      if (fullManifest) {
        componentStoreApi.createComponent(
          {
            manifestSchema: context.dragData.data.manifestSchema,
            pkg: fullManifest.pkg,
            key: fullManifest.manifest.meta.key,
          },
          {
            canvasZoneId: canvasZone.getAttribute("data-canvas-id")!,
            id: context.dragData.data.id,
            props: {},
            parent: { id: CANVAS_ZONE_ROOT_ID, index: 0 },
          }
        );
        window.parent.postMessage(
          {
            type: "COMPONENT_CREATED",
          },
          "*"
        );
        // return is stopper for running code outside
        return;
      }
    }
  }
  // send failed if something is not right
  window.parent.postMessage(
    {
      type: "DRAG_FAILED",
    },
    "*"
  );
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
  });
  window.document.addEventListener("mouseenter", (ev) => {
    canvasMachineInterpreter.send({
      type: "INSIDE_CANVAS",
      event: { pageX: ev.pageX, pageY: ev.pageY },
    });
  });
  window.document.addEventListener("mouseleave", (ev) => {
    canvasMachineInterpreter.send({
      type: "OUTSIDE_CANVAS",
      event: { pageX: ev.pageX, pageY: ev.pageY },
    });
  });
  window.addEventListener("mousemove", (ev) => {
    canvasMachineInterpreter.send({
      type: "MOUSE_MOVE",
      event: { pageX: ev.pageX, pageY: ev.pageY, target: ev.target },
    });
  });
  window.addEventListener("mouseup", (ev) => {
    canvasMachineInterpreter.send({
      type: "MOUSE_UP",
      event: { pageX: ev.pageX, pageY: ev.pageY, target: ev.target },
    });
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
