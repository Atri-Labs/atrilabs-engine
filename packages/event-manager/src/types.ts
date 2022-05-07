import { AnyEvent } from "@atrilabs/forest";

export type PageId = string;

export type EventManager = {
  meta: () => any;
  updateMeta: (data: any) => void;

  // takes page name and page route and returns page id
  createPage: (id: PageId, name: string, route: string) => void;
  // rename an existing page
  renamePage: (id: PageId, name: string) => void;
  // change router of a page
  changeRoute: (id: PageId, route: string) => void;

  // store an event for a page
  storeEvent: (pageId: PageId, event: AnyEvent) => void;
  // fetch all events for a page
  fetchEvents: (pageId: PageId) => AnyEvent[];

  // write back compressed events
  writeBackCompressedEvents: (pageId: PageId, events: AnyEvent[]) => void;

  // takes prefix and returns next number for the prefix
  incrementAlias: (prefix: string) => number;
};

export type ForestManager = {
  getEventManager: (name: string) => EventManager;
};
