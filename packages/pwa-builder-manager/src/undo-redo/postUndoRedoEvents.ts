import { BrowserForestManager } from "@atrilabs/core";
import {
  popFromRedoQueue,
  popFromUndoQueue,
  UNDO_REDO_NAME,
} from "./undoRedoStore";
import { api } from "../api";

export function undo() {
  const { forestPkgId, forestId } = BrowserForestManager.currentForest;
  const undoRecord = popFromUndoQueue(forestPkgId, forestId);
  if (undoRecord?.undo) {
    api.postNewEvents(forestPkgId, forestId, {
      events: undoRecord?.undo,
      meta: {
        agent: "browser",
      },
      name: UNDO_REDO_NAME,
    });
  }
}

export function redo() {
  const { forestPkgId, forestId } = BrowserForestManager.currentForest;
  const undoRecord = popFromRedoQueue(forestPkgId, forestId);
  if (undoRecord?.redo) {
    api.postNewEvents(forestPkgId, forestId, {
      events: undoRecord?.redo,
      meta: {
        agent: "browser",
      },
      name: UNDO_REDO_NAME,
    });
  }
}
