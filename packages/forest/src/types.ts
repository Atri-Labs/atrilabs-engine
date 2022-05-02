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

export type Tree = {
  nodes: { [id: string]: TreeNode };
  links: { [refId: string]: TreeLink };
  create: (event: Omit<CreateEvent, "type">) => void;
  patch: (event: Omit<PatchEvent, "type">) => void;
  del: (event: Omit<DeleteEvent, "type">) => void;
  link: (event: Omit<LinkEvent, "type">) => void;
  unlink: (event: Omit<UnlinkEvent, "type">) => void;
};

export type Forest = {
  name: string;
  tree: (name: string) => Tree | undefined;
  create: (event: CreateEvent) => void;
  patch: (event: PatchEvent) => void;
  del: (event: DeleteEvent) => void;
  link: (event: LinkEvent) => void;
  unlink: (event: UnlinkEvent) => void;
  handleEvent: (event: AnyEvent) => void;
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

export type TreeDef = {
  pkg: string;
  modulePath: string;
  name: string;
};

export type ForestDef = {
  name: string;
  trees: TreeDef[];
};

export type TreeDefReturnType = {
  validateCreate: (event: CreateEvent) => boolean;
  validatePatch: (event: PatchEvent) => boolean;
  onCreate: (event: CreateEvent) => void;
};
