import { editorAppMachineInterpreter, subscribeEditorMachine } from "./init";
import type {
  ClipboardPasteObjectWithParent,
  DragComp,
  DragData,
} from "@atrilabs/atri-app-core";
import {
  BrowserForestManager,
  createEventsFromManifest,
  getReactManifest,
} from "@atrilabs/core";
import { api } from "./api";
import { Id as ComponentTreeId } from "@atrilabs/app-design-forest/src/componentTree";
import { AnyEvent, CreateEvent, LinkEvent, PatchEvent } from "@atrilabs/forest";
import { aliasApi } from "./aliasApi";
import { postPasteEvents } from "./copy-paste/postPasteEvents";
import { getId } from "@atrilabs/core";

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
    if (ev.data?.type === "select" && ev.source !== null && ev.data.id) {
      editorAppMachineInterpreter.send({
        type: "SELECT",
        id: ev.data.id,
      });
    }
    if (ev.data?.type === "selectEnd" && ev.source !== null && ev.data.id) {
      editorAppMachineInterpreter.send({
        type: "SELECT_END",
        id: ev.data.id,
      });
    }
    if (ev.data?.type === "PASTE_EVENTS") {
      const { parent, newTemplateRootId, events } =
        ev.data as ClipboardPasteObjectWithParent;
      const { forestId, forestPkgId } = BrowserForestManager.currentForest;
      postPasteEvents({
        parent,
        newTemplateRootId,
        events,
        forestId,
        forestPkgId,
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

  if (event.type === "DRAG_SUCCESS" && context.dragData?.type === "component") {
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
      api.postNewEvents(
        forestPkgId,
        forestId,
        {
          events,
          name: "NEW_DROP",
          meta: { agent: "browser" },
        },
        (success) => {
          if (success) {
            aliasApi.assingAliasFromPrefix({
              prefix: key,
              id,
              postData: {
                name: "NEW_DROP_ALIAS",
                meta: { agent: "browser" },
                events: [],
              },
            });
          }
        }
      );
    }
  }
  if (event.type === "DRAG_SUCCESS" && context.dragData?.type === "template") {
    const { parent } = event;
    const { name, newTemplateRootId } = context.dragData!.data;
    const forestPkgId = BrowserForestManager.currentForest.forestPkgId;
    const forestId = BrowserForestManager.currentForest.forestId;
    //change alias / id before sending it to postNewEvents
    const oldAndNewIdMap: { [key: string]: string } = {};
    context.dragData.data.events.forEach((event) => {
      if (event.type.startsWith("CREATE$$")) {
        const eventData: CreateEvent = event as CreateEvent;
        oldAndNewIdMap[eventData.id] =
          eventData.state.parent.id === "__atri_canvas_zone_root__"
            ? newTemplateRootId
            : getId();
      }
    });
    const eventsModified = context.dragData.data.events.map(
      (event: AnyEvent) => {
        if (event.type.startsWith("CREATE$$")) {
          let eventData = event as CreateEvent;
          eventData.id = oldAndNewIdMap[eventData.id];
          if (eventData.state.parent.id === "__atri_canvas_zone_root__") {
            eventData.state.parent = { ...parent };
          } else if (eventData.state.parent.id) {
            eventData.state.parent.id =
              oldAndNewIdMap[eventData.state.parent.id];
          }
          if (eventData.state.alias) {
            const alias = aliasApi.createAliasFromPrefix(eventData.meta.key);
            eventData.state.alias = alias;
          }
          return eventData;
        } else if (event.type.startsWith("LINK$$")) {
          let eventData = event as LinkEvent;
          eventData.refId = oldAndNewIdMap[eventData.refId];
          eventData.childId = oldAndNewIdMap[eventData.childId];
          return eventData;
        }
      }
    );
    api.postNewEvents(
      forestPkgId,
      forestId,
      {
        events: eventsModified as AnyEvent[],
        name: "NEW_DROP",
        meta: { agent: "browser" },
      },
      (success) => {
        if (success) {
          aliasApi.assingAliasFromPrefix({
            prefix: name,
            id: newTemplateRootId,
            postData: {
              name: "NEW_DROP_ALIAS",
              meta: { agent: "browser" },
              events: [],
            },
          });
        }
      }
    );
  }
});

subscribeEditorMachine("REDROP_SUCCESSFUL", (_context, event) => {
  if (event.type === "REDROP_SUCCESSFUL") {
    const { parent, repositionComponent } = event;
    const { forestId, forestPkgId } = BrowserForestManager.currentForest;
    const patchEvent: PatchEvent = {
      type: `PATCH$$${ComponentTreeId}`,
      id: repositionComponent,
      slice: {
        parent: parent,
      },
    };
    api.postNewEvents(forestPkgId, forestId, {
      events: [patchEvent],
      name: "REDROP",
      meta: { agent: "browser" },
    });
  }
});

function mouseUpInPlayground(event: { pageX: number; pageY: number }) {
  editorAppMachineInterpreter.send({ type: "MOUSE_UP", event });
}

function raiseHoverEvent(compId: string) {
  editorAppMachineInterpreter.machine.context.canvasWindow?.postMessage(
    { type: "PROGRAMTIC_HOVER", id: compId },
    // @ts-ignore
    "*"
  );
}

function raiseSelectEvent(compId: string) {
  editorAppMachineInterpreter.machine.context.canvasWindow?.postMessage(
    { type: "PROGRAMTIC_SELECT", id: compId },
    // @ts-ignore
    "*"
  );
}

export const canvasApi = {
  navigatePage,
  startDrag,
  mouseUpInPlayground,
  raiseHoverEvent,
  raiseSelectEvent,
};
