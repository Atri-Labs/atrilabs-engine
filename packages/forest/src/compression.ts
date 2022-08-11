import {
  AnyEvent,
  CreateEvent,
  DeleteEvent,
  LinkEvent,
  PatchEvent,
  UnlinkEvent,
} from "./types";
import { mergeWith } from "lodash";

function mergeStateCustomizer(obj: any, src: any) {
  // replace array instead of default merge
  if (Array.isArray(obj)) {
    return src;
  }
}

function detectEventType(event: AnyEvent) {
  const [eventType, treeId] = event.type.split("$$");
  return { eventType, treeId };
}

/**
 * It implements a tree agnostic compression algorithm.
 * All patch events are merged. Only last link event is kept.
 * Only last unlink event is kept. A node is dropped if delete is emitted.
 */
export function compressEvents(events: AnyEvent[]) {
  const intermediateCompression: {
    [treeId: string]: {
      nodes: {
        [nodeId: string]: {
          create?: CreateEvent;
          patch?: PatchEvent;
          link?: LinkEvent;
          unlink?: UnlinkEvent;
          linkLast?: boolean;
          creationIndex?: number;
        };
      };
    };
  } = {};
  for (let i = 0; i < events.length; i++) {
    const event = events[i]!;
    const { eventType, treeId } = detectEventType(event);
    if (!eventType) {
      console.log(
        "ERROR: event type not found in event\n",
        JSON.stringify(event, null, 2)
      );
      continue;
    }
    if (!treeId) {
      console.log(
        "ERROR: treeId not found in event\n",
        JSON.stringify(event, null, 2)
      );
      continue;
    }
    if (intermediateCompression[treeId] === undefined) {
      intermediateCompression[treeId] = { nodes: {} };
    }
    switch (eventType) {
      case "CREATE":
        const createEvent = event as CreateEvent;
        const createdNodeId = createEvent.id;
        intermediateCompression[treeId]!.nodes[createdNodeId] = {
          ...intermediateCompression[treeId]!.nodes[createdNodeId],
          create: createEvent,
          creationIndex: i,
        };
        break;
      case "DELETE":
        const deleteEvent = event as DeleteEvent;
        const deletedNodeId = deleteEvent.id;
        delete intermediateCompression[treeId]!.nodes[deletedNodeId];
        break;
      case "PATCH":
        const patchEvent = event as PatchEvent;
        const patchedNodeId = patchEvent.id;
        if (intermediateCompression[treeId]!.nodes[patchedNodeId]?.patch) {
          const currentPatchEvent =
            intermediateCompression[treeId]!.nodes[patchedNodeId]!.patch!;
          // mutating current patch event by merging with new patch event
          mergeWith(
            currentPatchEvent.slice,
            patchEvent.slice,
            mergeStateCustomizer
          );
        } else {
          intermediateCompression[treeId]!.nodes[patchedNodeId] = {
            ...intermediateCompression[treeId]!.nodes[patchedNodeId],
            patch: patchEvent,
          };
        }
        break;
      case "LINK":
        const linkEvent = event as LinkEvent;
        const linkNodeId = linkEvent.childId;
        intermediateCompression[treeId]!.nodes[linkNodeId] = {
          ...intermediateCompression[treeId]!.nodes[linkNodeId],
          link: linkEvent,
          linkLast: true,
        };
        break;
      case "UNLINK":
        const unlinkEvent = event as UnlinkEvent;
        const unlinkNodeId = unlinkEvent.childId;
        intermediateCompression[treeId]!.nodes[unlinkNodeId] = {
          ...intermediateCompression[treeId]!.nodes[unlinkNodeId],
          unlink: unlinkEvent,
          linkLast: false,
        };
        break;
      default:
        console.log(
          "ERROR: unknown event type\n",
          JSON.stringify(event, null, 2)
        );
        break;
    }
  }

  // flatten all trees
  const allNodes = Object.keys(intermediateCompression)
    .map((treeId) => {
      return Object.keys(intermediateCompression[treeId]!.nodes).map(
        (nodeId) => {
          return { ...intermediateCompression[treeId]!.nodes[nodeId]!, nodeId };
        }
      );
    })
    .flat()
    .filter((node) => {
      return node.create !== undefined;
    });

  // sort nodes based on their creation index
  allNodes.sort((a, b) => {
    return a.creationIndex! - b.creationIndex!;
  });

  const newEvents: AnyEvent[] = [];
  allNodes.forEach((node) => {
    newEvents.push(node.create!);
    if (node.patch) newEvents.push(node.patch);
    if (node.linkLast !== undefined) {
      switch (node.linkLast) {
        case false:
          if (node.unlink) newEvents.push(node.unlink!);
          break;
        default:
          if (node.link) newEvents.push(node.link!);
      }
    }
  });

  return newEvents;
}
