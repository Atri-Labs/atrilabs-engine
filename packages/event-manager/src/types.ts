export type PageId = string;

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
  /** annotation for the relation */
  rel: string;
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

export type EventManager = () => {
  // takes page name and page route and returns page id
  createPage: (name: string, route: string) => PageId;
  // rename an existing page
  renamePage: (id: PageId, name: string) => void;
  // change router of a page
  changeRoute: (id: PageId, route: string) => void;

  // store an event for a page
  storeEvent: (pageId: PageId, event: AnyEvent) => void;
  // fetch all events for a page
  fetchEvent: (pageId: PageId) => AnyEvent[];

  // takes prefix and returns an alias
  createAlias: (prefix: string) => string;
};
