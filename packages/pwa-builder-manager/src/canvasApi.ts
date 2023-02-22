import { editorAppMachineInterpreter, subscribeEditorMachine } from "./init";
import type { DragComp, DragData } from "@atrilabs/atri-app-core";
import {
  BrowserForestManager,
  createEventsFromManifest,
  getReactManifest,
} from "@atrilabs/core";
import { api } from "./api";

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
    if (
      ev.data?.type === "DRAG_SUCCESS" &&
      ev.source !== null &&
      ev.data.parent
    ) {
      editorAppMachineInterpreter.send({
        type: "DRAG_SUCCESS",
        parent: ev.data.parent,
      });
    }
    if (ev.data?.type === "REDROP_FAILED" && ev.source !== null) {
      editorAppMachineInterpreter.send({ type: "REDROP_FAILED" });
    }
    if (
      ev.data?.type === "REDROP_SUCCESSFUL" &&
      ev.source !== null &&
      ev.data.parent
    ) {
      editorAppMachineInterpreter.send({
        type: "REDROP_SUCCESSFUL",
        parent: ev.data.parent,
        repositionComponent: ev.data.repositionComponent,
      });
    }
  }
});

subscribeEditorMachine("drag_in_progress", (context) => {
  const dragCompSerializable = {
    comp: context.dragComp?.comp,
    props: context.dragComp?.props,
  };
  delete dragCompSerializable.props["svg"];
  context.canvasWindow?.postMessage(
    {
      type: "drag_in_progress",
      dragData: context.dragData,
      dragComp: dragCompSerializable,
    },
    // @ts-ignore
    "*"
  );
});

subscribeEditorMachine("DRAG_FAILED", (context) => {
  // @ts-ignore
  context.canvasWindow?.postMessage({ type: "drag_stopped" }, "*");
});

subscribeEditorMachine("before_app_load", (context) => {
  BrowserForestManager.setCurrentForest(
    BrowserForestManager.currentForest.forestPkgId,
    context.currentRouteObjectPath
  );
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

subscribeEditorMachine("DRAG_FAILED", () => {
  removeMouseListeners();
});

subscribeEditorMachine("DRAG_SUCCESS", (context, event) => {
  removeMouseListeners();
  if (event.type === "DRAG_SUCCESS") {
    const { pkg, key, id, manifestSchema } = context.dragData!.data;
    const { parent } = event;
    const fullManifest = getReactManifest({ pkg, key });
    if (fullManifest) {
      const events = createEventsFromManifest({
        manifest: fullManifest.manifest,
        manifestSchema,
        compId: id,
        parent,
        pkg,
        key,
      });
      const forestPkgId = BrowserForestManager.currentForest.forestPkgId;
      const forestId = BrowserForestManager.currentForest.forestId;
      api.postNewEvents(forestPkgId, forestId, {
        events,
        name: "NEW_DROP",
        meta: { agent: "browser" },
      });
    }
  }
});

subscribeEditorMachine("REDROP_FAILED", () => {
  removeMouseListeners();
});

subscribeEditorMachine("REDROP_SUCCESSFUL", (context, event) => {
  removeMouseListeners();
  console.log("Reposition event fired", context, event);
  if (event.type === "REDROP_SUCCESSFUL") {
    //   const { pkg, key, id, manifestSchema } = context.dragData!.data;
    const { parent } = event;
    //   const fullManifest = getReactManifest({ pkg, key });
    //   if (fullManifest) {
    //     const events = createEventsFromManifest({
    //       manifest: fullManifest.manifest,
    //       manifestSchema,
    //       compId: id,
    //       parent,
    //       pkg,
    //       key,
    //     });
    //     const forestPkgId = BrowserForestManager.currentForest.forestPkgId;
    //     const forestId = BrowserForestManager.currentForest.forestId;
    //     api.postNewEvents(forestPkgId, forestId, {
    //       events,
    //       name: "",
    //       meta: { agent: "browser" },
    //     });
    //   }
  }
});

function mouseUpInPlayground(event: { pageX: number; pageY: number }) {
  editorAppMachineInterpreter.send({ type: "MOUSE_UP", event });
}

export const canvasApi = {
  navigatePage,
  startDrag,
  mouseUpInPlayground,
};
