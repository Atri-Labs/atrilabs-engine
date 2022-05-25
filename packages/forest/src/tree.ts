import { Tree, TreeDef, Forest } from "./types";

export function createTree(treeDef: TreeDef, forest: Forest) {
  const eventSuffix = treeDef.id;
  const tree: Tree = {
    nodes: {},
    links: {},
    create: (event) => {
      const createEvent = {
        ...event,
        type: `CREATE$$${eventSuffix}`,
      };
      forest.create(createEvent);
    },
    patch: (event) => {
      const patchEvent = {
        ...event,
        type: `PATCH${eventSuffix}`,
      };
      forest.patch(patchEvent);
    },
    del: (event) => {
      const delEvent = {
        ...event,
        type: `DELETE${eventSuffix}`,
      };
      forest.del(delEvent);
    },
    link: (event) => {
      const linkEvent = {
        ...event,
        type: `LINK${eventSuffix}`,
      };
      forest.link(linkEvent);
    },
    unlink: (event) => {
      const unlinkEvent = {
        ...event,
        type: `UNLINK${eventSuffix}`,
      };
      forest.link(unlinkEvent);
    },
  };
  return tree;
}
