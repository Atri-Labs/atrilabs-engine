export type TreeNode = {
  /** id of the created object */
  id: string;
  /**
   * contains information such as component key, category for an element
   */
  meta: any;
  /**
   * contains state of the element
   */
  state: { [key: string]: any } & { parent: { id: string; index: number } };
};

export type TreeLink = {
  /** id of the node in the parent tree */
  refId: string;
  /** id of the node in the child tree */
  childId: string;
};

export type EventDto = {
  type: string;
};

export type CreateEvent = TreeNode & EventDto;

export type PatchEvent = {
  id: string;
  /**
   * contains slice that can be applied to the state of an element
   */
  slice: any;
} & EventDto;

export type DeleteEvent = {
  // id of the element to be deleted
  id: string;
} & EventDto;

export type LinkEvent = TreeLink & EventDto;

export type UnlinkEvent = LinkEvent;

export type AnyEvent =
  | CreateEvent
  | PatchEvent
  | DeleteEvent
  | LinkEvent
  | UnlinkEvent;

export type ForestDef = {
  name: string;
  trees: {
    pkg: string;
    modulePath: string;
    name: string;
  }[];
};

export type TreeDefReturnType = {
  validateCreate: (event: CreateEvent) => boolean;
  validatePatch: (event: PatchEvent) => boolean;
  onCreate: (event: CreateEvent) => void;
};
