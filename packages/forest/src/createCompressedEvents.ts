import { AnyEvent, CreateEvent, ForestDef, LinkEvent } from "./types";
import { createForest } from "./forest";

export function createCompressedEvents(
  events: AnyEvent[],
  forestDef: ForestDef
) {
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

  const linkEvents: LinkEvent[] = [];
  const nonRootCreateEvents: CreateEvent[] = [];
  const rootCreateEvents: CreateEvent[] = [];

  // process non root trees first
  treeIds
    .filter((treeId) => treeId !== rootTreeId)
    .forEach((treeId) => {
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

      nodeIds.forEach((nodeId) => {
        const node = nodeMap[nodeId]!;
        linkEvents.push({
          type: `LINK$$${treeId}`,
          childId: nodeId,
          refId: reverseLinkMap[nodeId]!,
        });
        nonRootCreateEvents.push({
          type: `CREATE$$${treeId}`,
          id: nodeId,
          meta: node.meta,
          state: node.state,
        });
      });
    });

  rootTreeNodeIds.forEach((nodeId) => {
    const node = rootTreeNodeMap[nodeId]!;
    rootCreateEvents.push({
      type: `CREATE$$${rootTreeId}`,
      id: nodeId,
      meta: node.meta,
      state: node.state,
    });
  });

  return { linkEvents, nonRootCreateEvents, rootCreateEvents };
}
