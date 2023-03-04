import {
  AnyEvent,
  HardPatchEvent,
  PatchEvent,
  TreeNode,
} from "@atrilabs/forest";
import ComponentTreeId from "@atrilabs/app-design-forest/src/componentTree?id";
import { CreateEvent, DeleteEvent } from "@atrilabs/forest";
import { BrowserForestManager } from "@atrilabs/core";
import { componentApi } from "../componentApi";

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

      if (
        update.type === "dewire" &&
        update.treeId === ComponentTreeId &&
        update.topNode.id === update.deletedNode.id
      ) {
        const deletedNodes = update.deletedNodes;
        const createEvents = deletedNodes.map((node) => {
          const deletedNode = JSON.parse(JSON.stringify(node)) as TreeNode;
          const createEvent: CreateEvent = {
            type: `CREATE$$${ComponentTreeId}`,
            id: deletedNode.id,
            meta: deletedNode.meta,
            state: deletedNode.state,
          };
          return createEvent;
        });
        const deleteEvent: DeleteEvent = {
          type: `DELETE$$${ComponentTreeId}`,
          id: update.topNode.id,
        };
        addToUndoQueue(forestPkgId, forestId, {
          undo: createEvents,
          redo: [deleteEvent],
        });
      }

      if (update.type === "rewire" && update.treeId === ComponentTreeId) {
        const { compId, oldParent, newParent } = update;
        const oldPatchEvent: PatchEvent = {
          type: `PATCH$$${ComponentTreeId}`,
          id: compId,
          slice: {
            parent: { ...oldParent },
          },
        };
        const newPatchEvent: PatchEvent = {
          type: `PATCH$$${ComponentTreeId}`,
          id: compId,
          slice: {
            parent: { ...newParent },
          },
        };
        addToUndoQueue(forestPkgId, forestId, {
          undo: [oldPatchEvent],
          redo: [newPatchEvent],
        });
      }

      if (
        update.type === "change" &&
        name !== "NEW_DROP" &&
        name !== "NEW_DROP_ALIAS"
      ) {
        const nodeId = update.id;
        const treeId = update.treeId;
        const node =
          BrowserForestManager.currentForest.tree(treeId)!.nodes[nodeId];
        const oldState = JSON.parse(JSON.stringify(update.oldState));
        const newState = JSON.parse(JSON.stringify(node.state));
        // deleting parent from state to avoid error message in console
        delete oldState["parent"];
        delete newState["parent"];
        const oldPatch: HardPatchEvent = {
          type: `HARDPATCH$$${treeId}`,
          id: nodeId,
          state: oldState,
        };
        const newPatch: HardPatchEvent = {
          type: `HARDPATCH$$${treeId}`,
          id: nodeId,
          state: newState,
        };
        addToUndoQueue(forestPkgId, forestId, {
          undo: [oldPatch],
          redo: [newPatch],
        });
      }

      if (
        update.type === "wire" &&
        name === "TEMPLATE_EVENTS" &&
        update.treeId === ComponentTreeId &&
        custom &&
        custom["topmostId"] !== undefined
      ) {
        // identify the component id of outermost component
        const currentNodeId = update.id;
        if (currentNodeId === custom["topmostId"]) {
          // TODO: create and push undo record
          const compNode = componentTree.nodes[currentNodeId];
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
                const reverseMap = componentApi.createReverseMap(
                  componentTree.nodes,
                  compNode.id
                );
                const allDeletedNodeIds = [compNode.id].concat(
                  componentApi.getAllNodeIdsFromReverseMap(
                    reverseMap,
                    compNode.id
                  )
                );
                const createEvents = allDeletedNodeIds.map((nodeId) => {
                  const deletedNode = JSON.parse(
                    JSON.stringify(componentTree.nodes[nodeId])
                  ) as TreeNode;
                  const createEvent: CreateEvent = {
                    type: `CREATE$$${ComponentTreeId}`,
                    id: deletedNode.id,
                    meta: deletedNode.meta,
                    state: deletedNode.state,
                  };
                  return createEvent;
                });
                return { ...oldRecord, redo: createEvents };
              },
            });
          }
        }
      }
    }
  }
);
