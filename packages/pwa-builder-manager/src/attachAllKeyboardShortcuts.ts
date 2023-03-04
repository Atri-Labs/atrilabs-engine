import { BrowserForestManager } from "@atrilabs/core";
import { api } from "./api";
import ComponentTreeId from "@atrilabs/app-design-forest/src/componentTree?id";
import { DeleteEvent } from "@atrilabs/forest";
import { createEventsThatCanBeCopied } from "./copy-paste/createEventsThatCanBeCopied";
import { putInClipboard, readFromClipboard } from "./copy-paste/clipboard";
import { editorAppMachineInterpreter, subscribeEditorMachine } from "./init";
import { CANVAS_ZONE_ROOT_ID } from "@atrilabs/atri-app-core/src/api";
import { componentApi } from "./componentApi";
import { undo, redo } from "./undo-redo/postUndoRedoEvents";

function isMac() {
  if (window.navigator && window.navigator.userAgent) {
    if (window.navigator.userAgent.indexOf("Mac") >= 0) {
      return true;
    }
  }
  return false;
}

function isDeleteKeyPressed(ev: KeyboardEvent) {
  if (isMac()) {
    return ev.key.toLowerCase() === "backspace";
  } else {
    return ev.key.toLowerCase() === "delete";
  }
}

function handleDelete() {
  window.addEventListener("message", (ev) => {
    if (ev.data?.type === "KEY_DOWN") {
      if (ev.data.event && isDeleteKeyPressed(ev.data.event)) {
        const forestPkgId = BrowserForestManager.currentForest.forestPkgId;
        const forestId = BrowserForestManager.currentForest.forestId;
        const deleteEvent: DeleteEvent = {
          type: `DELETE$$${ComponentTreeId}`,
          id: ev.data.id,
        };
        api.postNewEvents(forestPkgId, forestId, {
          name: "DELETE",
          events: [deleteEvent],
          meta: { agent: "browser" },
        });
      }
    }
  });
}

function isCopyShortcutPressed(ev: KeyboardEvent) {
  if (isMac()) {
    return ev.key.toLowerCase() === "c" && ev.metaKey;
  } else {
    return ev.key.toLowerCase() === "c" && ev.ctrlKey;
  }
}

function isPasteShortcutPressed(ev: KeyboardEvent) {
  if (isMac()) {
    return ev.key.toLowerCase() === "v" && ev.metaKey;
  } else {
    return ev.key.toLowerCase() === "v" && ev.ctrlKey;
  }
}

function handleCopyPaste() {
  window.addEventListener("message", (ev) => {
    if (ev.data?.type === "KEY_DOWN" && ev.data.event && ev.data.id) {
      if (isCopyShortcutPressed(ev.data.event)) {
        const compId = ev.data.id;
        const events = createEventsThatCanBeCopied({
          compId,
          copyCallbacks: true,
          copyDefaulCallbacks: false,
        });
        putInClipboard({ events, copiedCompId: compId });
      }
      if (isPasteShortcutPressed(ev.data.event)) {
        readFromClipboard().then((copyObject) => {
          if (copyObject) {
            editorAppMachineInterpreter.machine.context.canvasWindow?.postMessage(
              {
                ...copyObject,
                type: "atri-paste-events",
                pasteTargetComp: ev.data.id,
              },
              // @ts-ignore
              "*"
            );
          }
        });
      }
    }
  });
}

function handleArrowKeys() {
  let selectedCompId: string | null = null;
  subscribeEditorMachine("SELECT", (_context, event) => {
    if (event.type === "SELECT") selectedCompId = event.id;
  });
  subscribeEditorMachine("SELECT_END", (_context, event) => {
    if (event.type === "SELECT") selectedCompId = null;
  });
  window.addEventListener("message", (ev) => {
    if (
      ev.data?.type === "KEY_DOWN" &&
      ev.data.event &&
      ev.data.id &&
      selectedCompId
    ) {
      const keyboardEvent = ev.data.event as KeyboardEvent;
      if (keyboardEvent.key.toLowerCase() === "arrowup") {
        const compTree =
          BrowserForestManager.currentForest.tree(ComponentTreeId);
        const selectedCompNode = compTree?.nodes[selectedCompId];
        if (selectedCompNode) {
          const parentId = selectedCompNode.state.parent.id;
          if (parentId !== CANVAS_ZONE_ROOT_ID) {
            editorAppMachineInterpreter.machine.context.canvasWindow?.postMessage(
              { type: "PROGRAMTIC_SELECT", id: parentId },
              // @ts-ignore
              "*"
            );
          }
        }
      }
      if (keyboardEvent.key.toLowerCase() === "arrowdown") {
        const compTree =
          BrowserForestManager.currentForest.tree(ComponentTreeId);
        const selectedCompNode = compTree?.nodes[selectedCompId];
        if (selectedCompNode) {
          const parentChildMap = componentApi.createSortedParentChildMap(
            compTree!.nodes,
            selectedCompId
          );
          if (
            parentChildMap &&
            parentChildMap[selectedCompId] &&
            parentChildMap[selectedCompId].length > 0
          ) {
            const childCompId = parentChildMap[selectedCompId][0];
            editorAppMachineInterpreter.machine.context.canvasWindow?.postMessage(
              { type: "PROGRAMTIC_SELECT", id: childCompId },
              // @ts-ignore
              "*"
            );
          }
        }
      }
      if (keyboardEvent.key.toLowerCase() === "arrowright") {
        const compTree =
          BrowserForestManager.currentForest.tree(ComponentTreeId);
        const selectedCompNode = compTree?.nodes[selectedCompId];
        if (
          selectedCompNode &&
          selectedCompNode.state.parent.id !== CANVAS_ZONE_ROOT_ID
        ) {
          const parentChildMap = componentApi.createSortedParentChildMap(
            compTree!.nodes,
            selectedCompNode.state.parent.id
          );
          const parentIdOfSelectedNode = selectedCompNode.state.parent.id;
          if (
            parentChildMap &&
            parentChildMap[parentIdOfSelectedNode] &&
            parentChildMap[parentIdOfSelectedNode].length > 0
          ) {
            const selectedCompIndex = parentChildMap[
              parentIdOfSelectedNode
            ].findIndex((curr) => curr === selectedCompId);
            if (
              selectedCompIndex >= 0 &&
              parentChildMap[parentIdOfSelectedNode][selectedCompIndex + 1]
            ) {
              editorAppMachineInterpreter.machine.context.canvasWindow?.postMessage(
                {
                  type: "PROGRAMTIC_SELECT",
                  id: parentChildMap[parentIdOfSelectedNode][
                    selectedCompIndex + 1
                  ],
                },
                // @ts-ignore
                "*"
              );
            }
          }
        }
      }
      if (keyboardEvent.key.toLowerCase() === "arrowleft") {
        const compTree =
          BrowserForestManager.currentForest.tree(ComponentTreeId);
        const selectedCompNode = compTree?.nodes[selectedCompId];
        if (
          selectedCompNode &&
          selectedCompNode.state.parent.id !== CANVAS_ZONE_ROOT_ID
        ) {
          const parentChildMap = componentApi.createSortedParentChildMap(
            compTree!.nodes,
            selectedCompNode.state.parent.id
          );
          const parentIdOfSelectedNode = selectedCompNode.state.parent.id;
          if (
            parentChildMap &&
            parentChildMap[parentIdOfSelectedNode] &&
            parentChildMap[parentIdOfSelectedNode].length > 0
          ) {
            const selectedCompIndex = parentChildMap[
              parentIdOfSelectedNode
            ].findIndex((curr) => curr === selectedCompId);
            if (
              selectedCompIndex >= 0 &&
              selectedCompIndex - 1 >= 0 &&
              parentChildMap[parentIdOfSelectedNode][selectedCompIndex - 1]
            ) {
              editorAppMachineInterpreter.machine.context.canvasWindow?.postMessage(
                {
                  type: "PROGRAMTIC_SELECT",
                  id: parentChildMap[parentIdOfSelectedNode][
                    selectedCompIndex - 1
                  ],
                },
                // @ts-ignore
                "*"
              );
            }
          }
        }
      }
    }
  });
}

function isUndoPressed(ev: KeyboardEvent) {
  if (isMac()) {
    return ev.key.toLowerCase() === "z" && ev.metaKey;
  } else {
    return ev.key.toLowerCase() === "z" && ev.ctrlKey;
  }
}

function isRedoPressed(ev: KeyboardEvent) {
  if (isMac()) {
    return ev.key.toLowerCase() === "z" && ev.metaKey && ev.shiftKey;
  } else {
    return ev.key.toLowerCase() === "y" && ev.ctrlKey;
  }
}

function handleUndoRedo() {
  window.addEventListener("message", (ev) => {
    if (ev.data?.type === "KEY_DOWN" && ev.data.event && ev.data.id) {
      if (isUndoPressed(ev.data.event)) {
        undo();
      }
      if (isRedoPressed(ev.data.event)) {
        redo();
      }
    }
  });
}

function attachAllKeyboardShortcuts() {
  handleDelete();
  handleCopyPaste();
  handleArrowKeys();
  handleUndoRedo();
}

attachAllKeyboardShortcuts();

export {};
