import { editorAppMachineInterpreter, subscribeEditorMachine } from "./init";
import type { DragComp, DragData } from "@atrilabs/atri-app-core";

window.addEventListener("message", (ev) => {
  if (
    ev.origin === editorAppMachineInterpreter.machine.context.appInfo?.hostname
  ) {
    if (ev.data === "ready") {
      editorAppMachineInterpreter.send({ type: "CANVAS_IFRAME_LOADED" });
    }
  }
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
