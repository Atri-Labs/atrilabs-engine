import { BrowserForestManager } from "@atrilabs/core";
import { api } from "./api";
import ComponentTreeId from "@atrilabs/app-design-forest/src/componentTree?id";
import { DeleteEvent } from "@atrilabs/forest";

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

function attachAllKeyboardShortcuts() {
  handleDelete();
}

attachAllKeyboardShortcuts();

export {};
