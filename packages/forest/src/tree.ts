import { Forest } from "./forest";
import {
  CreateEvent,
  DeleteEvent,
  ForestDef,
  LinkEvent,
  PatchEvent,
  TreeLink,
  TreeNode,
  UnlinkEvent,
} from "./types";

export type Tree = ReturnType<typeof createTree>;

export type TreeDef = ForestDef["trees"][0];

export function createTree(treeDef: TreeDef, forest: Forest) {
  const eventSuffix = `$$${treeDef.pkg}$$${treeDef.modulePath}`;
  const tree: {
    nodes: { [id: string]: TreeNode };
    links: { [refId: string]: TreeLink };
    create: (event: Omit<CreateEvent, "type">) => void;
    patch: (event: Omit<PatchEvent, "type">) => void;
    del: (event: Omit<DeleteEvent, "type">) => void;
    link: (event: Omit<LinkEvent, "type">) => void;
    unlink: (event: Omit<UnlinkEvent, "type">) => void;
  } = {
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
