import path from "path";
import fs from "fs";
import {
  createForest,
  AnyEvent,
  Tree,
  createCompressedEvents,
  LinkEvent,
  CreateEvent,
} from "@atrilabs/forest";
import {
  forestDef,
  componentTreeDef,
  attributesTreeDef,
} from "@atrilabs/atri-app-core/src/api/forestDef";
import { getId } from "@atrilabs/atri-app-core/src/utils/getId";

function attrNodeExists(options: { nodeId: string; attrTree: Tree }) {
  const { nodeId, attrTree } = options;
  if (attrTree.links[nodeId] === undefined) {
    return false;
  }
  return true;
}

function createNonRootEvents(options: { treeId: string; compId: string }) {
  const { treeId, compId } = options;
  const newNodeId = getId();
  return {
    linkEvent: {
      type: `LINK$$${treeId}`,
      childId: newNodeId,
      refId: compId,
    },
    createEvent: {
      type: `CREATE$$${treeId}`,
      id: newNodeId,
      meta: {},
      state: { parent: { id: "", index: 0 } },
    },
  };
}

export function fixEvents(options: { eventsFilepath: string }) {
  const absEventsFilepath = path.resolve(options.eventsFilepath);

  const events: AnyEvent[] = JSON.parse(
    fs.readFileSync(absEventsFilepath).toString()
  );

  const forest = createForest(forestDef);
  forest.handleEvents({
    name: "compat",
    events,
    meta: { agent: "server-sent" },
  });
  const compTree = forest.tree(componentTreeDef.id)!;
  const attrTree = forest.tree(attributesTreeDef.id)!;

  const nodeIds = Object.keys(compTree);

  const newNonRootEvents: { linkEvent: LinkEvent; createEvent: CreateEvent }[] =
    [];

  nodeIds.forEach((nodeId) => {
    if (!attrNodeExists({ nodeId, attrTree })) {
      newNonRootEvents.push(
        createNonRootEvents({
          treeId: attributesTreeDef.id,
          compId: nodeId,
        })
      );
    }
  });

  const { linkEvents, nonRootCreateEvents, rootCreateEvents } =
    createCompressedEvents(events, forestDef);

  if (newNonRootEvents.length > 0) {
    console.log(`Adding ${newNonRootEvents.length * 2} events.`);
    newNonRootEvents.forEach(({ linkEvent, createEvent }) => {
      linkEvents.push(linkEvent);
      nonRootCreateEvents.push(createEvent);
    });
  }

  const hasFixes = newNonRootEvents.length > 0;

  if (hasFixes) {
    console.log(`Overwriting ${absEventsFilepath}`);
    console.log(nonRootCreateEvents === undefined);
    console.log(rootCreateEvents === undefined);
    console.log(linkEvents === undefined);
    fs.writeFileSync(
      options.eventsFilepath,
      JSON.stringify(
        [...nonRootCreateEvents, ...rootCreateEvents, ...linkEvents],
        null,
        2
      )
    );
  }
}
