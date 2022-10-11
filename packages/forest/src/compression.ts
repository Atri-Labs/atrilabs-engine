import { AnyEvent, ForestDef } from "./types";
import { createForest } from "./forest";

/**
 * It implements a tree agnostic compression algorithm.
 * All patch events are merged. Only last link event is kept.
 * Only last unlink event is kept. A node is dropped if delete is emitted.
 */
export function compressEvents(events: AnyEvent[], forestDef: ForestDef) {
  if (forestDef.trees.length === 0) {
    throw Error("Need atleas one tree in ForestDef");
  }

  const forest = createForest(forestDef);
  forest.handleEvents({
    name: "COMPRESSION",
    events,
    meta: { agent: "server-sent" },
  });
  const treeIds = forestDef.trees.map((treeDef) => {
    return treeDef.id;
  });

  const rootTreeId = treeIds[0]!;
  // root tree components
  const rootTree = forest.tree(rootTreeId)!;
  const rootTreeNodeMap = rootTree.nodes;
  const rootTreeNodeIds = Object.keys(rootTreeNodeMap);

  // process non root trees first
  const nonRootTreeEvents = treeIds
    .filter((treeId) => treeId !== rootTreeId)
    .map((treeId) => {
      const tree = forest.tree(treeId)!;
      const nodeMap = tree.nodes;
      const linkRefIds = Object.keys(tree.links);
      // keep only those nodes that are linked to root tree
      const nodeIds = linkRefIds
        .filter((refId) => {
          return refId in rootTreeNodeMap;
        })
        .map((refId) => {
          return tree.links[refId]!.childId;
        });

      const reverseLinkMap: { [childId: string]: string } = {};
      linkRefIds.forEach((linkRefId) => {
        reverseLinkMap[tree.links[linkRefId]!.childId] = linkRefId;
      });

      return nodeIds.map((nodeId): AnyEvent[] => {
        const node = nodeMap[nodeId]!;
        return [
          {
            type: `CREATE$$${treeId}`,
            id: nodeId,
            meta: node.meta,
            state: node.state,
          },
          {
            type: `LINK$$${treeId}`,
            childId: nodeId,
            refId: reverseLinkMap[nodeId]!,
          },
        ];
      });
    })
    .flat()
    .flat();

  const rootTreeEvents = rootTreeNodeIds.map((nodeId): AnyEvent => {
    const node = rootTreeNodeMap[nodeId]!;
    return {
      type: `CREATE$$${rootTreeId}`,
      id: nodeId,
      meta: node.meta,
      state: node.state,
    };
  });

  return [...nonRootTreeEvents, ...rootTreeEvents];
}
