import { merge } from "lodash";
import { createTree, Tree } from "./tree";
import {
  CreateEvent,
  ForestDef,
  LinkEvent,
  PatchEvent,
  UnlinkEvent,
  DeleteEvent,
  TreeDefReturnType,
  AnyEvent,
} from "./types";

type FromPromise<T> = T extends Promise<infer U> ? U : never;

export type Forest = FromPromise<ReturnType<typeof createForest>>;

async function importAllTrees(treeDefs: ForestDef["trees"]) {
  const importedModules = treeDefs.map((def) => {
    return import(require.resolve(`${def.pkg}/${def.modulePath}`)).then(
      (mod) => mod.default
    );
  });
  return await Promise.all(importedModules);
}

export default async function createForest(def: ForestDef) {
  const treeDefs = def.trees;

  if (treeDefs.length === 0) {
    throw Error("Atleast one tree definition is required");
  }
  const rootDef = def.trees[0]!;

  // import all trees from definition
  const defaultFns = await importAllTrees(treeDefs);

  // create a map for easily accessing a tree when an event arrives
  const defaultFnMap: { [id: string]: TreeDefReturnType } = {};
  const shortNameMap: { [id: string]: string } = {};
  treeDefs.forEach((def, index) => {
    const id = `${def.modulePath}$$${def.pkg}`;
    defaultFnMap[id] = defaultFns[index]() as TreeDefReturnType;
    shortNameMap[id] = def.name;
  });

  const isRootTree = (treeId: string) => {
    if (treeId === `${rootDef.modulePath}$$${rootDef.pkg}`) {
      return true;
    }
    return false;
  };

  // create an empty map of trees to be filled once API for forest is ready below
  const treeMap: { [name: string]: Tree } = {};

  /**
   * EXPOSE API
   */
  const name = def.name;

  // get a tree by it's name
  function tree(name: string) {
    return treeMap[name];
  }

  // record all link events in the forest to process unlink
  // called as a result of deleting something in root tree
  const linkEvents: { [refId: string]: LinkEvent[] } = {};

  function handleEvent(event: AnyEvent) {
    if (event.type.startsWith("CREATE")) {
      const createEvent = event as CreateEvent;
      const treeId = createEvent.type.slice(0, "CREATE$$".length);
      if (defaultFnMap[treeId]!.validateCreate(createEvent)) {
        const shortName = shortNameMap[treeId]!;
        treeMap[shortName]!.nodes[createEvent.id] = {
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
        const shortName = shortNameMap[treeId]!;
        merge(
          treeMap[shortName]!.nodes[patchEvent.id]!["state"],
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
      const shortName = shortNameMap[treeId]!;
      delete treeMap[shortName]!.nodes[delEvent.id];
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
  function patch(event: PatchEvent) {}

  // delete a node
  function del(event: DeleteEvent) {}

  // link nodes between two trees
  function link(event: LinkEvent) {}

  // unlink nodes between two trees
  function unlink(event: UnlinkEvent) {}

  const forest = { name, tree, create, patch, del, link, unlink };

  // create trees and add it to the map
  treeDefs.forEach((def) => {
    const tree = createTree(def, forest);
    treeMap[def.name] = tree;
  });

  return forest;
}
