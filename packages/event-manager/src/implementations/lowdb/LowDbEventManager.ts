import Lowdb, { LowdbSync } from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import path from "path";
import { AnyEvent, EventManager, PageId } from "../../types";
import { AliasDbSchema, PagesDbSchema, EvensDbSchema } from "./types";

export type LowDbEventManagerOptions = {
  dbDir: string;
};

function checkFileLayout(dbDir: string): boolean {
  return false;
}

function createFileLayout(dbDir: string) {}

function openAliasDb(dbDir: string): LowdbSync<AliasDbSchema> {
  const aliasFile = path.resolve(dbDir, "alias.json");
  const aliasDb = Lowdb(new FileSync<AliasDbSchema>(aliasFile));
  aliasDb.read();
  return aliasDb;
}

function openPagesDb(dbDir: string): LowdbSync<PagesDbSchema> {
  const pagesFile = path.resolve(dbDir, "pages.json");
  const pagesDb = Lowdb(new FileSync<PagesDbSchema>(pagesFile));
  pagesDb.read();
  return pagesDb;
}

function openEventsDb(dbDir: string, pageId: string): LowdbSync<EvensDbSchema> {
  const eventsFile = path.resolve(dbDir, pageId, "events.json");
  const eventsDb = Lowdb(new FileSync<EvensDbSchema>(eventsFile));
  eventsDb.read();
  return eventsDb;
}

export default function createLowDbEventManager(
  options: LowDbEventManagerOptions
): EventManager {
  const dbDir = options.dbDir;

  // create files with default content if file doesn't exists already
  if (!checkFileLayout(dbDir)) {
    createFileLayout(dbDir);
  }

  const pagesDb = openPagesDb(dbDir);

  const aliasDb = openAliasDb(dbDir);

  const openPages: {
    [id: string]: {
      eventsDb: LowdbSync<AnyEvent[]>;
    };
  } = {};

  function createPage(id: PageId, name: string, route: string) {
    // do nothing if a page with id PageId already exists
    if (pagesDb.getState()[id]) {
      console.log(
        `Error: Page with id ${id} already exists. Cannot create a new page.`
      );
      return;
    }
    pagesDb.getState()[id] = { name, route };
  }

  function renamePage(id: PageId, name: string) {
    if (!pagesDb.getState()[id]) {
      console.log(`Error: Page with id ${id} does not exist. Cannot rename.`);
      return;
    }
    pagesDb.getState()[id]!["name"] = name;
  }

  function changeRoute(id: PageId, route: string) {
    if (!pagesDb.getState()[id]) {
      console.log(
        `Error: Page with id ${id} does not exist. Cannot change route.`
      );
      return;
    }
    pagesDb.getState()[id]!["route"] = route;
  }

  function storeEvent(pageId: PageId, event: AnyEvent) {
    if (!openPages[pageId]) {
      const eventsDb = openEventsDb(dbDir, pageId);
      openPages[pageId] = { eventsDb };
    }
    const eventsDb = openPages[pageId]!["eventsDb"];
    eventsDb.getState().push(event);
  }

  function fetchEvents(pageId: PageId): AnyEvent[] {
    // open pages db if not already open
    if (!openPages[pageId]) {
      const eventsDb = openEventsDb(dbDir, pageId);
      openPages[pageId] = { eventsDb };
    }
    return openPages[pageId]!.eventsDb.getState();
  }

  function compressEvents(pageId: PageId): AnyEvent[] {}

  function writeBackCompressedEvents(pageId: PageId) {}

  function incrementAlias(prefix: string): number {
    if (aliasDb.getState()[prefix] !== undefined) {
      const oldValue = aliasDb.getState()[prefix]!;
      const newValue = oldValue + 1;
      aliasDb.getState()[prefix] = newValue;
      return newValue;
    }
    aliasDb.getState()[prefix] = 1;
    return aliasDb.getState()[prefix]!;
  }

  return {
    createPage,
    renamePage,
    changeRoute,
    storeEvent,
    fetchEvents,
    compressEvents,
    writeBackCompressedEvents,
    incrementAlias,
  };
}
