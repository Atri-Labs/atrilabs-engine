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
  tree: (name: string) => Tree | undefined;
  create: (event: CreateEvent) => void;
  patch: (event: PatchEvent) => void;
  del: (event: DeleteEvent) => void;
  link: (event: LinkEvent) => void;
  unlink: (event: UnlinkEvent) => void;
  handleEvent: (event: AnyEvent) => void;
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

export type AnyEvent =
  | CreateEvent
  | PatchEvent
  | DeleteEvent
  | LinkEvent
  | UnlinkEvent;

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
};

export type DewireUpdate = {
  type: "dewire";
  childId: string;
  parentId: string;
};

export type RewireUpdate = {
  type: "rewire";
  childId: string;
  oldParentId: string;
  newParentId: string;
};

export type ChangeUpdate = {
  type: "change";
  id: string;
};

export type LinkUpdate = {
  type: "link";
  refId: string;
  childId: string;
};

export type UnlinkUpdate = {
  type: "unlink";
  refId: string;
  childId: string;
};

export type ForestUpdate =
  | WireUpdate
  | DewireUpdate
  | RewireUpdate
  | ChangeUpdate
  | LinkEvent
  | UnlinkUpdate;

export type ForestUpdateSubscriber = (update: ForestUpdate) => void;

export type ForestUpdateUnsubscriber = () => void;
