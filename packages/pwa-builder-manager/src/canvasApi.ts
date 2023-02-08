import { editorAppMachineInterpreter, subscribeEditorMachine } from "./init";
import type { DragComp, DragData } from "@atrilabs/atri-app-core";

window.addEventListener("message", (ev) => {
  if (
    ev.origin === editorAppMachineInterpreter.machine.context.appInfo?.hostname
  ) {
    if (ev.data?.type === "ready" && ev.source !== null) {
      editorAppMachineInterpreter.send({
        type: "CANVAS_IFRAME_LOADED",
        canvasWindow: ev.source,
      });
    }
    if (ev.data?.type === "INSIDE_CANVAS" && ev.source !== null) {
      editorAppMachineInterpreter.send({
        type: "INSIDE_CANVAS",
        event: ev.data?.event,
      });
    }
    if (ev.data?.type === "OUTSIDE_CANVAS" && ev.source !== null) {
      editorAppMachineInterpreter.send({
        type: "OUTSIDE_CANVAS",
        event: ev.data?.event,
      });
    }
    if (ev.data?.type === "DRAG_FAILED" && ev.source !== null) {
      editorAppMachineInterpreter.send({ type: "DRAG_FAILED" });
    }
  }
});

subscribeEditorMachine("drag_in_progress", (context) => {
  context.canvasWindow?.postMessage(
    { type: "drag_in_progress" },
    // @ts-ignore
    "*"
  );
});

subscribeEditorMachine("drag_failed", (context) => {
  // @ts-ignore
  context.canvasWindow?.postMessage({ type: "drag_stopped" }, "*");
});

function navigatePage(urlPath: string) {
  editorAppMachineInterpreter.send({ type: "NAVIGATE_PAGE", urlPath });
}

function mouseMoveListener(ev: MouseEvent) {
  editorAppMachineInterpreter.send({
    type: "MOUSE_MOVE",
    event: { pageX: ev.pageX, pageY: ev.pageY },
  });
}

function mouseUpListener(ev: MouseEvent) {
  editorAppMachineInterpreter.send({
    type: "MOUSE_UP",
    event: { pageX: ev.pageX, pageY: ev.pageY },
  });
}

function attachMouseListeners() {
  window.addEventListener("mousemove", mouseMoveListener);
  window.addEventListener("mouseup", mouseUpListener);
}

function removeMouseListeners() {
  window.removeEventListener("mousemove", mouseMoveListener);
  window.removeEventListener("mouseup", mouseUpListener);
}

function startDrag(dragComp: DragComp, dragData: DragData) {
  attachMouseListeners();
  editorAppMachineInterpreter.send({ type: "START_DRAG", dragData, dragComp });
}

subscribeEditorMachine("drag_failed", () => {
  removeMouseListeners();
});

subscribeEditorMachine("component_created", () => {
  removeMouseListeners();
});

function mouseUpInPlayground(event: { pageX: number; pageY: number }) {
  editorAppMachineInterpreter.send({ type: "MOUSE_UP", event });
}

export const canvasApi = {
  navigatePage,
  startDrag,
  mouseUpInPlayground,
};
