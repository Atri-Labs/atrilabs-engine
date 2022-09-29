import { api, BrowserForestManager } from "@atrilabs/core";
import {
  AnyEvent,
  CreateEvent,
  DeleteEvent,
  PatchEvent,
  TreeNode,
} from "@atrilabs/forest";
import { useCallback, useEffect } from "react";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";

type UndoRecord = { undo: AnyEvent[]; redo: AnyEvent[] };

type Queue = {
  [forestPkgId: string]: {
    [pageId: string]: { events: UndoRecord[] };
  };
};

const undoQueue: Queue = {};
const redoQueue: Queue = {};

function addToUndoQueue(
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

function addToRedoQueue(
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

export const useStoreUndoRedoEvents = () => {
  const undo = useCallback(() => {
    const { forestPkgId, forestId } = BrowserForestManager.currentForest;
    const undoRecord = popFromUndoQueue(forestPkgId, forestId);
    // TODO: call patchCb without record flag
    console.log(undoRecord?.undo);
    if (undoRecord?.undo) {
      undoRecord?.undo.forEach((event) => {
        api.postNewEvent(forestPkgId, forestId, event, {
          agent: "server-sent",
        });
      });
    }
  }, []);
  const redo = useCallback(() => {
    const { forestPkgId, forestId } = BrowserForestManager.currentForest;
    const undoRecord = popFromRedoQueue(forestPkgId, forestId);
    // TODO: call patchCb without record flag
    console.log(undoRecord?.redo);
    if (undoRecord?.redo) {
      undoRecord?.redo.forEach((event) => {
        api.postNewEvent(forestPkgId, forestId, event, {
          agent: "server-sent",
        });
      });
    }
  }, []);

  // TODO: subscribe forest manager

  useEffect(() => {
    const { subscribeForest } = BrowserForestManager.currentForest;
    const unsub = subscribeForest((update, { agent }) => {
      const { forestId, forestPkgId } = BrowserForestManager.currentForest;
      const componentTree =
        BrowserForestManager.currentForest.tree(ComponentTreeId);

      if (agent === "browser" && componentTree) {
        if (update.type === "wire" && update.treeId === ComponentTreeId) {
          const compNode = componentTree.nodes[update.id];
          const { key, pkg } = compNode.meta;
          if (key && pkg) {
            const createEvent: CreateEvent = {
              type: `CREATE$$${ComponentTreeId}`,
              ...JSON.parse(JSON.stringify(compNode)),
            };
            const newDeleteCompEvent: DeleteEvent = {
              type: `DELETE$$${ComponentTreeId}`,
              id: compNode.id,
            };
            addToUndoQueue(forestPkgId, forestId, {
              undo: [newDeleteCompEvent],
              redo: [createEvent],
            });
          }
        }
        if (update.type === "dewire" && update.treeId === ComponentTreeId) {
          const deletedNode = JSON.parse(
            JSON.stringify(update.deletedNode)
          ) as TreeNode;
          const createEvent: CreateEvent = {
            type: `CREATE$$${ComponentTreeId}`,
            id: deletedNode.id,
            meta: deletedNode.meta,
            state: deletedNode.state,
          };
          const deleteEvent: DeleteEvent = {
            type: `DELETE$$${ComponentTreeId}`,
            id: deletedNode.id,
          };
          addToUndoQueue(forestPkgId, forestId, {
            undo: [createEvent],
            redo: [deleteEvent],
          });
        }
        if (update.type === "change") {
          const nodeId = update.id;
          const treeId = update.treeId;
          const node =
            BrowserForestManager.currentForest.tree(treeId)!.nodes[nodeId];
          const oldState = update.oldState;
          const newState = JSON.parse(JSON.stringify(node.state));
          const oldPatch: PatchEvent = {
            type: `PATCH$$${treeId}`,
            id: nodeId,
            slice: oldState,
          };
          const newPatch: PatchEvent = {
            type: `PATCH$$${treeId}`,
            id: nodeId,
            slice: newState,
          };
          addToUndoQueue(forestPkgId, forestId, {
            undo: [oldPatch],
            redo: [newPatch],
          });
        }
      }
    });
    return unsub;
  }, []);

  return { undo, redo };
};
