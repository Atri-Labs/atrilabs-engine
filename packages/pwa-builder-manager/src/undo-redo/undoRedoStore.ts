import { AnyEvent } from "@atrilabs/forest";
import ComponentTreeId from "@atrilabs/app-design-forest/src/componentTree?id";
import { CreateEvent, DeleteEvent } from "@atrilabs/forest";
import { BrowserForestManager } from "@atrilabs/core";

type UndoRecord = {
  undo: AnyEvent[];
  redo: AnyEvent[];
  beforeUndo?: (oldRecord: UndoRecord) => UndoRecord;
};

type Queue = {
  [forestPkgId: string]: {
    [pageId: string]: { events: UndoRecord[] };
  };
};

const undoQueue: Queue = {};
const redoQueue: Queue = {};

export function addToUndoQueue(
  forestPkgId: string,
  pageId: string,
  undoEvent: UndoRecord
) {
  if (!(forestPkgId in undoQueue)) {
    undoQueue[forestPkgId] = {};
  }
  if (!(pageId in undoQueue[forestPkgId])) {
    undoQueue[forestPkgId][pageId] = { events: [] };
  }
  undoQueue[forestPkgId][pageId].events.push(undoEvent);
}

export function addToRedoQueue(
  forestPkgId: string,
  pageId: string,
  undoEvent: UndoRecord
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
  if (forestPkgId in undoQueue && pageId in undoQueue[forestPkgId]) {
    const poppedEvent = undoQueue[forestPkgId][pageId].events.pop();
    if (poppedEvent) {
      if (poppedEvent.beforeUndo) {
        const newUndoRecord = poppedEvent.beforeUndo(
          JSON.parse(JSON.stringify(poppedEvent))
        );
        poppedEvent.redo = newUndoRecord.redo;
        poppedEvent.undo = newUndoRecord.undo;
      }
      addToRedoQueue(forestPkgId, pageId, poppedEvent);
    }
    return poppedEvent;
  }
}

export function popFromRedoQueue(forestPkgId: string, pageId: string) {
  if (forestPkgId in redoQueue && pageId in redoQueue[forestPkgId]) {
    const poppedEvent = redoQueue[forestPkgId][pageId].events.pop();
    if (poppedEvent) {
      addToUndoQueue(forestPkgId, pageId, poppedEvent);
    }
    return poppedEvent;
  }
}

export function clearRedoQueue(forestPkgId: string, pageId: string) {
  if (forestPkgId in redoQueue && pageId in redoQueue[forestPkgId]) {
    redoQueue[forestPkgId][pageId] = { events: [] };
  }
}

export const UNDO_REDO_NAME = "UNDO_REDO_EVENT";

BrowserForestManager.currentForest.subscribeForest(
  (update, { meta: { agent, custom }, name }) => {
    if (name === UNDO_REDO_NAME) {
      return;
    }

    const { forestId, forestPkgId } = BrowserForestManager.currentForest;
    const componentTree =
      BrowserForestManager.currentForest.tree(ComponentTreeId);

    // added to handle issue #389
    clearRedoQueue(forestPkgId, forestId);

    if (agent === "browser" && componentTree) {
      if (
        update.type === "wire" &&
        update.treeId === ComponentTreeId &&
        name === "NEW_DROP"
      ) {
        const compNode = componentTree.nodes[update.id];
        const { key, pkg } = compNode.meta;
        if (key && pkg) {
          const newDeleteCompEvent: DeleteEvent = {
            type: `DELETE$$${ComponentTreeId}`,
            id: compNode.id,
          };
          addToUndoQueue(forestPkgId, forestId, {
            undo: [newDeleteCompEvent],
            redo: [],
            beforeUndo: (oldRecord) => {
              const compNode = componentTree.nodes[update.id];
              const createEvent: CreateEvent = {
                type: `CREATE$$${ComponentTreeId}`,
                ...JSON.parse(JSON.stringify(compNode)),
              };
              return { ...oldRecord, redo: [createEvent] };
            },
          });
        }
      }
    }
  }
);
