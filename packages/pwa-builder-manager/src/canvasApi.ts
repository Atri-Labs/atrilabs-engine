import { editorAppMachineInterpreter } from "./init";
import type { DragData } from "@atrilabs/atri-app-core";

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

function startDrag(dragData: DragData) {
  editorAppMachineInterpreter.send({ type: "START_DRAG", dragData });
}

export const canvasApi = {
  navigatePage,
  startDrag,
};
