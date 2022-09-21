import { api, BrowserForestManager } from "@atrilabs/core";
import {
  AnyEvent,
  CreateEvent,
  DeleteEvent,
  PatchEvent,
} from "@atrilabs/forest";
import { useCallback, useEffect } from "react";

type UndoEvent = { undo: AnyEvent[]; redo: AnyEvent[] };

type Queue = {
  [forestPkgId: string]: {
    [pageId: string]: { events: UndoEvent[] };
  };
};

const undoQueue: Queue = {};
const redoQueue: Queue = {};

function addToUndoQueue(
  forestPkgId: string,
  pageId: string,
  undoEvent: UndoEvent
) {
  if (!(forestPkgId in undoQueue)) {
    undoQueue[forestPkgId] = {};
  }
  if (!(pageId in undoQueue[forestPkgId])) {
    undoQueue[forestPkgId][pageId] = { events: [] };
  }
  undoQueue[forestPkgId][pageId].events.push(undoEvent);
}

function addToRedoQueue(
  forestPkgId: string,
  pageId: string,
  undoEvent: UndoEvent
) {
  if (!(forestPkgId in redoQueue)) {
    redoQueue[forestPkgId] = {};
  }
  if (!(pageId in redoQueue[forestPkgId])) {
    redoQueue[forestPkgId][pageId] = { events: [] };
  }
  redoQueue[forestPkgId][pageId].events.push(undoEvent);
}

export function popFromUndoQueue(forestPkgId: string, pageId: string) {
  const poppedEvent = undoQueue[forestPkgId][pageId].events.pop();
  if (poppedEvent) {
    addToRedoQueue(forestPkgId, pageId, poppedEvent);
  }
  return poppedEvent;
}

export function popFromRedoQueue(forestPkgId: string, pageId: string) {
  const poppedEvent = redoQueue[forestPkgId][pageId].events.pop();
  if (poppedEvent) {
    addToUndoQueue(forestPkgId, pageId, poppedEvent);
  }
  return poppedEvent;
}

export const useStoreUndoRedoEvents = () => {
  const undo = useCallback(() => {
    const { forestPkgId, forestId } = BrowserForestManager.currentForest;
    const undoEvent = popFromUndoQueue(forestPkgId, forestId);
    // TODO: call patchCb without record flag
    console.log(undoEvent?.undo);
  }, []);
  const redo = useCallback(() => {
    const { forestPkgId, forestId } = BrowserForestManager.currentForest;
    const undoEvent = popFromRedoQueue(forestPkgId, forestId);
    // TODO: call patchCb without record flag
    console.log(undoEvent?.redo);
  }, []);

  // TODO: subscribe forest manager

  useEffect(() => {
    const { subscribeForest } = BrowserForestManager.currentForest;
    const unsub = subscribeForest((update, { agent }) => {
      if (agent === "browser") {
      }
    });
    return unsub;
  }, []);

  api.subscribeOwnEvents((forestPkgId, pageId, event) => {
    // TODO: check if record flag is true  otherwise ignore
    if (event.type.startsWith("CREATE")) {
      const createEvent = event as CreateEvent;
      const pkgName = createEvent.type.split("$$")[1];
      // new events
      const newDeleteCompEvent: DeleteEvent = {
        type: `DELETE$$${pkgName}`,
        id: createEvent.id,
      };
      addToUndoQueue(forestPkgId, pageId, {
        undo: [newDeleteCompEvent],
        redo: [createEvent],
      });
    } else if (event.type.startsWith("DELETE")) {
      const deleteEvent = event as CreateEvent;
      const pkgName = deleteEvent.type.split("$$")[1];
      // TODO:
      // get meta and state from browserForestManager

      // new events
      const newCreateCompEvent: CreateEvent = {
        type: `CREATE$$${pkgName}`,
        id: deleteEvent.id,
        meta: {},
        state: { parent: { id: "", index: 0 } },
      };
      addToUndoQueue(forestPkgId, pageId, {
        undo: [newCreateCompEvent],
        redo: [deleteEvent],
      });
    } else if (event.type.startsWith("PATCH")) {
      const patchEvent = event as PatchEvent;
      const pkgName = patchEvent.type.split("$$")[1];
      // TODO:
      // need old state of the patched tree to put as slice

      // new events
      const newPatchCompEvent: PatchEvent = {
        type: `PATCH$$${pkgName}`,
        id: patchEvent.id,
        slice: {},
      };
      addToUndoQueue(forestPkgId, pageId, {
        undo: [newPatchCompEvent],
        redo: [patchEvent],
      });
    }
  });

  return { undo, redo };
};
