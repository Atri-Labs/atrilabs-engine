import { BrowserForestManager } from "@atrilabs/core";
import { api } from "./api";
import ComponentTreeId from "@atrilabs/app-design-forest/src/componentTree?id";
import { DeleteEvent } from "@atrilabs/forest";
import { createEventsThatCanBeCopied } from "./copy-paste/createEventsThatCanBeCopied";
import { putInClipboard, readFromClipboard } from "./copy-paste/clipboard";
import { editorAppMachineInterpreter } from "./init";

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

function attachAllKeyboardShortcuts() {
  handleDelete();
  handleCopyPaste();
}

attachAllKeyboardShortcuts();

export {};
