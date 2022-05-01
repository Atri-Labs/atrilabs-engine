import { Forest } from "./forest";
import { Tree, ForestDef } from "./types";

export type TreeDef = ForestDef["trees"][0];

export function createTree(treeDef: TreeDef, forest: Forest) {
  const eventSuffix = `$$${treeDef.pkg}$$${treeDef.modulePath}`;
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
