import { merge } from "lodash";
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
} from "./types";

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

  function handleEvent(event: AnyEvent) {
    if (event.type.startsWith("CREATE")) {
      const createEvent = event as CreateEvent;
      const treeId = createEvent.type.slice(0, "CREATE$$".length);
      if (defaultFnMap[treeId]!.validateCreate(createEvent)) {
        treeMap[treeId]!.nodes[createEvent.id] = {
          id: createEvent.id,
          meta: createEvent.meta,
          state: createEvent.state,
        };
      }
    }
    if (event.type.startsWith("PATCH")) {
      const patchEvent = event as PatchEvent;
      const treeId = patchEvent.type.slice(0, "PATCH$$".length);
      if (defaultFnMap[treeId]!.validatePatch(patchEvent)) {
        merge(
          treeMap[treeId]!.nodes[patchEvent.id]!["state"],
          patchEvent.slice
        );
      }
    }
    if (event.type.startsWith("DELETE")) {
      const delEvent = event as DeleteEvent;
      const treeId = delEvent.type.slice(0, "DELETE$$".length);
      // if event is from a root tree, call unlink on all child tree
      if (isRootTree(treeId)) {
        if (linkEvents[delEvent.id]) {
          linkEvents[delEvent.id]!.forEach((event) => {
            const unlinkEvent = { ...event, type: `UNLINK$$${treeId}` };
            handleEvent(unlinkEvent);
          });
        }
      }
      delete treeMap[treeId]!.nodes[delEvent.id];
    }
    if (event.type.startsWith("LINK")) {
      const linkEvent = event as LinkEvent;
      const treeId = linkEvent.type.slice(0, "LINK$$".length);
      treeMap[treeId]!.links[linkEvent.refId] = linkEvent;
      // record all link events in the forest to process unlink
      // called as a result of deleting something in root tree
      linkEvents[linkEvent.refId]
        ? linkEvents[linkEvent.refId]?.push(linkEvent)
        : (linkEvents[linkEvent.refId] = [linkEvent]);
    }
    if (event.type.startsWith("UNLINK")) {
      const unlinkEvent = event as UnlinkEvent;
      const treeId = unlinkEvent.type.slice(0, "UNLINK$$".length);
      delete treeMap[treeId]!.links[unlinkEvent.refId];
    }
  }

  // create a node
  function create(event: CreateEvent) {
    const type = event.type.slice(0, "CREATE$$".length);
    handleEvent(event);
    defaultFnMap[type]!.onCreate(event);
  }

  // patch a node
  function patch(event: PatchEvent) {
    handleEvent(event);
  }

  // delete a node
  function del(event: DeleteEvent) {
    handleEvent(event);
  }

  // link nodes between two trees
  function link(event: LinkEvent) {
    handleEvent(event);
  }

  // unlink nodes between two trees
  function unlink(event: UnlinkEvent) {
    handleEvent(event);
  }

  const forest = { tree, create, patch, del, link, unlink, handleEvent };

  // create trees and add it to the map
  treeDefs.forEach((def) => {
    const tree = createTree(def, forest);
    treeMap[def.modulePath] = tree;
  });

  return forest;
}
