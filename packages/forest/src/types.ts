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
  create: (event: Omit<CreateEvent, "type">, meta: EventMetaData) => void;
  patch: (event: Omit<PatchEvent, "type">, meta: EventMetaData) => void;
  del: (event: Omit<DeleteEvent, "type">, meta: EventMetaData) => void;
  link: (event: Omit<LinkEvent, "type">, meta: EventMetaData) => void;
  unlink: (event: Omit<UnlinkEvent, "type">, meta: EventMetaData) => void;
};

export type EventMetaData = { agent: "browser" | "server-sent"; custom?: any };

export type Forest = {
  tree: (name: string) => Tree | undefined;
  create: (event: CreateEvent, meta: EventMetaData) => void;
  patch: (event: PatchEvent, meta: EventMetaData) => void;
  del: (event: DeleteEvent, meta: EventMetaData) => void;
  link: (event: LinkEvent, meta: EventMetaData) => void;
  unlink: (event: UnlinkEvent, meta: EventMetaData) => void;
  handleEvents: (data: {
    name: string;
    events: AnyEvent[];
    meta: EventMetaData;
  }) => void;
  subscribeForest: (cb: ForestUpdateSubscriber) => ForestUpdateUnsubscriber;
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

export type HardPatchEvent = {
  id: string;
  state: any;
  // apply the state to a selected field only
  selector?: string[];
} & EventDto;

export type AnyEvent =
  | CreateEvent
  | PatchEvent
  | DeleteEvent
  | LinkEvent
  | UnlinkEvent
  | HardPatchEvent;

export type TreeDefReturnType = {
  validateCreate: (event: CreateEvent) => boolean;
  validatePatch: (event: PatchEvent) => boolean;
  onCreate: (event: CreateEvent) => void;
};

export type TreeDef = {
  // id will be computed from modulePath
  id: string;
  modulePath: string;
  defFn: () => TreeDefReturnType;
};

export type ForestDef = {
  // id will be computed from pkg
  id: string;
  pkg: string;
  trees: TreeDef[];
};

export type Folder = {
  id: string;
  name: string;
  parentId: string;
};

// A Page is an actual instance of forest
// Page["id"] === forestId
export type Page = {
  id: string;
  name: string;
  folderId: string;
};

export type MetaData = {
  folders: { [folderId: string]: Folder };
  pages: { [pageId: string]: Folder["id"] };
};

export type PageDetails = { name: string; route: string };

export type EventManager = {
  meta: () => MetaData;
  updateMeta: (data: MetaData) => void;

  pages: () => { [id: Page["id"]]: PageDetails };
  // takes page name and page route and returns page id
  createPage: (id: Page["id"], name: string, route: string) => void;
  // rename an existing page
  renamePage: (id: Page["id"], name: string) => void;
  // change router of a page
  changeRoute: (id: Page["id"], route: string) => void;
  // delete a page
  deletePage: (id: Page["id"]) => void;

  // store an event for a page
  storeEvent: (pageId: Page["id"], event: AnyEvent) => void;
  // fetch all events for a page
  fetchEvents: (pageId: Page["id"]) => AnyEvent[];

  // write back compressed events
  writeBackCompressedEvents: (pageId: Page["id"], events: AnyEvent[]) => void;

  // takes prefix and returns next number for the prefix
  incrementAlias: (prefix: string) => number;
};

export type ForestManager = {
  getEventManager: (name: string) => EventManager;
};

export type ForestsConfig = {
  [forestPkg: string]: Pick<TreeDef, "modulePath">[];
};

export type WireUpdate = {
  type: "wire";
  id: string;
  parentId: string;
  treeId: string;
};

export type DewireUpdate = {
  type: "dewire";
  childId: string;
  parentId: string;
  treeId: string;
  // the node for which this dewire event is emitted
  deletedNode: TreeNode;
  // the top most node that was deleted. The dewire event is emitted for
  // it's child as well. Hence, to differentiate this field is also supplied.
  topNode: TreeNode;
  deletedNodes: TreeNode[];
};

export type RewireUpdate = {
  type: "rewire";
  childId: string;
  oldParentId: string;
  newParentId: string;
  newIndex: number;
  oldIndex: number;
  treeId: string;
};

export type ChangeUpdate = {
  type: "change";
  id: string;
  treeId: string;
  oldState: any;
};

export type LinkUpdate = {
  type: "link";
  refId: string;
  childId: string;
  treeId: string;
  rootTreeId: string;
};

export type UnlinkUpdate = {
  type: "unlink";
  refId: string;
  childId: string;
  treeId: string;
  rootTreeId: string;
};

export type ForestUpdate =
  | WireUpdate
  | DewireUpdate
  | RewireUpdate
  | ChangeUpdate
  | LinkUpdate
  | UnlinkUpdate;

export type ForestUpdateSubscriber = (
  update: ForestUpdate,
  more: {
    name: string;
    meta: EventMetaData;
  }
) => void;

export type ForestUpdateUnsubscriber = () => void;
