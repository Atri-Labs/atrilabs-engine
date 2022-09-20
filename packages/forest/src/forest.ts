import { mergeWith } from "lodash";
import { createTree } from "./tree";
import {
  CreateEvent,
  ForestDef,
  LinkEvent,
  PatchEvent,
  UnlinkEvent,
  DeleteEvent,
  TreeDefReturnType,
  AnyEvent,
  Tree,
  Forest,
  ForestUpdateSubscriber,
  EventMetaData,
} from "./types";

function mergeStateCustomizer(obj: any, src: any) {
  // replace array instead of default merge
  if (Array.isArray(obj)) {
    return src;
  }
}

export function createForest(def: ForestDef): Forest {
  const treeDefs = def.trees;

  if (treeDefs.length === 0) {
    throw Error("Atleast one tree definition is required");
  }
  const rootDef = def.trees[0]!;

  // create a map for easily accessing a tree when an event arrives
  const defaultFnMap: { [treeId: string]: TreeDefReturnType } = {};
  treeDefs.forEach((def) => {
    const id = def.modulePath;
    defaultFnMap[id] = def.defFn();
  });

  const isRootTree = (treeId: string) => {
    if (treeId === rootDef.modulePath) {
      return true;
    }
    return false;
  };

  // create an empty map of trees to be filled once API for forest is ready below
  const treeMap: { [treeId: string]: Tree } = {};

  const forestUpdateSubscribers: ForestUpdateSubscriber[] = [];

  /**
   * EXPOSE API
   */

  // get a tree by it's name
  function tree(treeId: string) {
    return treeMap[treeId];
  }

  // record all link events in the forest to process unlink
  // called as a result of deleting something in root tree
  const linkEvents: { [refId: string]: LinkEvent[] } = {};

  function createReverseMap(nodes: Tree["nodes"]) {
    const reverseMap: { [parentId: string]: string[] } = {};
    Object.keys(nodes).forEach((nodeId) => {
      const node = nodes[nodeId]!;
      const parentId = node.state.parent.id;
      if (reverseMap[parentId]) {
        reverseMap[parentId]!.push(nodeId);
      } else {
        reverseMap[parentId] = [nodeId];
      }
    });
    return reverseMap;
  }

  function handleEvent(event: AnyEvent, meta: EventMetaData) {
    if (event.type.startsWith("CREATE")) {
      const createEvent = event as CreateEvent;
      const treeId = createEvent.type.slice("CREATE$$".length);
      if (defaultFnMap[treeId]!.validateCreate(createEvent)) {
        treeMap[treeId]!.nodes[createEvent.id] = {
          id: createEvent.id,
          meta: createEvent.meta,
          state: createEvent.state,
        };
        forestUpdateSubscribers.forEach((cb) => {
          cb(
            {
              type: "wire",
              id: createEvent.id,
              parentId: createEvent.state.parent.id,
              treeId,
            },
            meta
          );
        });
      }
    }
    if (event.type.startsWith("PATCH")) {
      const patchEvent = event as PatchEvent;
      const treeId = patchEvent.type.slice("PATCH$$".length);
      if (defaultFnMap[treeId]!.validatePatch(patchEvent)) {
        // patch parent
        if (patchEvent.slice && patchEvent.slice.parent) {
          if (patchEvent.slice.parent.id && patchEvent.slice.parent.index) {
            const oldParentId =
              tree(treeId)?.nodes[patchEvent.id]?.state.parent.id;
            const oldIndex =
              tree(treeId)?.nodes[patchEvent.id]?.state.parent.index;
            if (oldParentId !== undefined && oldIndex !== undefined) {
              tree(treeId)!.nodes[patchEvent.id]!["state"] = mergeWith(
                JSON.parse(
                  JSON.stringify(tree(treeId)!.nodes[patchEvent.id]!["state"])
                ),
                JSON.parse(JSON.stringify(patchEvent.slice)),
                mergeStateCustomizer
              );
              forestUpdateSubscribers.forEach((cb) => {
                cb(
                  {
                    type: "rewire",
                    treeId,
                    childId: patchEvent.id,
                    newParentId: patchEvent.slice.parent.id,
                    newIndex: patchEvent.slice.parent.index,
                    oldIndex,
                    oldParentId,
                  },
                  meta
                );
              });
            }
            return;
          } else {
            console.error(
              "The parent field's id and index must be updated together. Ignoring the patch event."
            );
            return;
          }
        }
        // patch other fields
        tree(treeId)!.nodes[patchEvent.id]!["state"] = mergeWith(
          JSON.parse(
            JSON.stringify(tree(treeId)!.nodes[patchEvent.id]!["state"])
          ),
          JSON.parse(JSON.stringify(patchEvent.slice)),
          mergeStateCustomizer
        );
        forestUpdateSubscribers.forEach((cb) => {
          cb({ type: "change", id: patchEvent.id, treeId }, meta);
        });
      }
    }
    if (event.type.startsWith("DELETE")) {
      const delEvent = event as DeleteEvent;
      const treeId = delEvent.type.slice("DELETE$$".length);
      // find all children and add them to be delete array
      const nodesToBeDeleted = [delEvent.id];
      const reverseMap = createReverseMap(treeMap[treeId]!.nodes);
      if (reverseMap[delEvent.id]) {
        nodesToBeDeleted.push(...reverseMap[delEvent.id]!);
      }
      nodesToBeDeleted.reverse().forEach((nodeId) => {
        // if event is from a root tree, call unlink on all child tree
        if (isRootTree(treeId)) {
          if (linkEvents[nodeId]) {
            linkEvents[nodeId]!.forEach((event) => {
              const unlinkEvent = { ...event, type: `UNLINK$$${treeId}` };
              handleEvent(unlinkEvent, meta);
            });
          }
        }
        const parentId = treeMap[treeId]!.nodes[nodeId]!.state.parent.id;
        delete treeMap[treeId]!.nodes[nodeId];
        forestUpdateSubscribers.forEach((cb) => {
          cb({ type: "dewire", childId: nodeId, parentId, treeId }, meta);
        });
      });
    }
    if (event.type.startsWith("LINK")) {
      const linkEvent = event as LinkEvent;
      const treeId = linkEvent.type.slice("LINK$$".length);
      treeMap[treeId]!.links[linkEvent.refId] = linkEvent;
      // record all link events in the forest to process unlink
      // called as a result of deleting something in root tree
      linkEvents[linkEvent.refId]
        ? linkEvents[linkEvent.refId]?.push(linkEvent)
        : (linkEvents[linkEvent.refId] = [linkEvent]);
      forestUpdateSubscribers.forEach((cb) => {
        cb(
          {
            type: "link",
            refId: linkEvent.refId,
            childId: linkEvent.childId,
            treeId: treeId,
            rootTreeId: rootDef.id,
          },
          meta
        );
      });
    }
    if (event.type.startsWith("UNLINK")) {
      const unlinkEvent = event as UnlinkEvent;
      const treeId = unlinkEvent.type.slice("UNLINK$$".length);
      delete treeMap[treeId]!.links[unlinkEvent.refId];
      forestUpdateSubscribers.forEach((cb) => {
        cb(
          {
            type: "unlink",
            refId: unlinkEvent.refId,
            childId: unlinkEvent.childId,
            treeId: treeId,
            rootTreeId: rootDef.id,
          },
          meta
        );
      });
    }
  }

  // create a node
  function create(event: CreateEvent, meta: EventMetaData) {
    const type = event.type.slice("CREATE$$".length);
    handleEvent(event, meta);
    defaultFnMap[type]!.onCreate(event);
  }

  // patch a node
  function patch(event: PatchEvent, meta: EventMetaData) {
    handleEvent(event, meta);
  }

  // delete a node
  function del(event: DeleteEvent, meta: EventMetaData) {
    handleEvent(event, meta);
  }

  // link nodes between two trees
  function link(event: LinkEvent, meta: EventMetaData) {
    handleEvent(event, meta);
  }

  // unlink nodes between two trees
  function unlink(event: UnlinkEvent, meta: EventMetaData) {
    handleEvent(event, meta);
  }

  // subscibe forest
  function subscribeForest(cb: ForestUpdateSubscriber) {
    forestUpdateSubscribers.push(cb);
    return () => {
      const index = forestUpdateSubscribers.findIndex((curr) => curr === cb);
      if (index >= 0) {
        forestUpdateSubscribers.splice(index, 1);
      }
    };
  }

  const forest = {
    tree,
    create,
    patch,
    del,
    link,
    unlink,
    handleEvent,
    subscribeForest,
  };

  // create trees and add it to the map
  treeDefs.forEach((def) => {
    const tree = createTree(def, forest);
    treeMap[def.modulePath] = tree;
  });

  return forest;
}
