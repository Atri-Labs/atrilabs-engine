import { Tree, TreeDef, Forest } from "./types";

export function createTree(treeDef: TreeDef, forest: Forest) {
  const eventSuffix = treeDef.id;
  const tree: Tree = {
    nodes: {},
    links: {},
    create: (event, meta) => {
      const createEvent = {
        ...event,
        type: `CREATE$$${eventSuffix}`,
      };
      forest.create(createEvent, meta);
    },
    patch: (event, meta) => {
      const patchEvent = {
        ...event,
        type: `PATCH$$${eventSuffix}`,
      };
      forest.patch(patchEvent, meta);
    },
    del: (event, meta) => {
      const delEvent = {
        ...event,
        type: `DELETE$$${eventSuffix}`,
      };
      forest.del(delEvent, meta);
    },
    link: (event, meta) => {
      const linkEvent = {
        ...event,
        type: `LINK$$${eventSuffix}`,
      };
      forest.link(linkEvent, meta);
    },
    unlink: (event, meta) => {
      const unlinkEvent = {
        ...event,
        type: `UNLINK$$${eventSuffix}`,
      };
      forest.link(unlinkEvent, meta);
    },
  };
  return tree;
}
