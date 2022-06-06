import Lowdb, { LowdbSync } from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import path from "path";
import fs from "fs";
import { AnyEvent, EventManager, Page } from "../../types";
import {
  AliasDbSchema,
  PagesDbSchema,
  EvensDbSchema,
  LayoutErrorReport,
  LayoutErrorType,
  OpenDbs,
} from "./types";

export type LowDbEventManagerOptions = {
  dbDir: string;
};

function metaFile(dbDir: string) {
  return path.resolve(dbDir, "meta.json");
}

function pagesFile(dbDir: string) {
  return path.resolve(dbDir, "pages.json");
}

function aliasFile(dbDir: string) {
  return path.resolve(dbDir, "alias.json");
}

function eventFile(dbDir: string, pageId: string) {
  return path.resolve(dbDir, "events", pageId, "events.json");
}
/**
 * <rootDir>
 * - meta.json (the schema of this file is decided by the server-client using this implementation)
 * - pages.json (contains page-id and it's name)
 * - alias.json (contains alias and it's count)
 * - events/ (contains one file for each page)
 *    - xxx-pageid-events.json
 *
 * Initial state of these files:
 * meta.json              <- empty
 * pages.json             <- {}
 * alias.json             <- {}
 * xxx-pageid-events.json <- []
 * @param dbDir root directory where all the files will be saved
 * @returns true if file layout is valid
 */
function checkFileLayout(dbDir: string): {
  hasError: boolean;
  report: LayoutErrorReport;
} {
  const hasError = false;
  const report: LayoutErrorReport = {};
  if (!fs.existsSync(metaFile(dbDir))) {
    report.meta = LayoutErrorType.missing;
  }
  if (!fs.existsSync(aliasFile(dbDir))) {
    report.alias = LayoutErrorType.missing;
  } else {
    const data = fs.readFileSync(aliasFile(dbDir)).toString();
    if (data.match(/^\s\s*\s$/)) {
      report.alias = LayoutErrorType.empty;
    }
  }
  if (!fs.existsSync(pagesFile(dbDir))) {
    report.pages = LayoutErrorType.missing;
  } else {
    const data = fs.readFileSync(pagesFile(dbDir)).toString();
    if (data.match(/^\s\s*\s$/)) {
      report.pages = LayoutErrorType.empty;
    } else {
      try {
        const json = JSON.parse(fs.readFileSync(pagesFile(dbDir)).toString());
        if (typeof json !== "object")
          report.pages = LayoutErrorType.invalidData;
      } catch {
        report.pages = LayoutErrorType.invalidData;
      }
    }
  }
  // check for event files only if there are no errors for pages
  if (report.pages === undefined) {
    const json = JSON.parse(fs.readFileSync(pagesFile(dbDir)).toString());
    const pageIds = Object.keys(json);
    pageIds.forEach((pageId) => {
      if (!fs.existsSync(eventFile(dbDir, pageId))) {
        if (report.events === undefined) {
          report.events = {};
        }
        report.events[pageId] = LayoutErrorType.missing;
      } else {
        const data = fs.readFileSync(eventFile(dbDir, pageId)).toString();
        if (data.match(/^\s\s*\s$/)) {
          if (report.events === undefined) {
            report.events = {};
          }
          report.events[pageId] = LayoutErrorType.empty;
        } else {
          try {
            const json = JSON.parse(data);
            if (typeof json !== "object" && !Array.isArray(json)) {
              if (report.events === undefined) {
                report.events = {};
              }
              report.events[pageId] = LayoutErrorType.invalidData;
            }
          } catch {
            if (report.events === undefined) {
              report.events = {};
            }
            report.events[pageId] = LayoutErrorType.invalidData;
          }
        }
      }
    });
  }
  return { hasError, report };
}

/**
 * It fixes the dbDir in following ways:
 * - Create any missing file with it's initial value
 * - It also ensures that all pages mentioned in pages.json have a events file in events directory
 * @param dbDir root directory where all the files will be saved
 */
function fixFileLayout(dbDir: string, report: LayoutErrorReport) {
  let hasUnfixedErrors = false;
  const reportAfterFixes: LayoutErrorReport = {};
  if (report.meta) {
    if (report.meta.valueOf() === LayoutErrorType.missing.valueOf())
      fs.writeFileSync(metaFile(dbDir), "");
    else {
      hasUnfixedErrors = true;
      reportAfterFixes.meta = report.meta;
    }
  }
  if (report.alias) {
    if (report.alias.valueOf() === LayoutErrorType.missing.valueOf())
      fs.writeFileSync(aliasFile(dbDir), "{}");
    else {
      hasUnfixedErrors = true;
      reportAfterFixes.alias = report.alias;
    }
  }
  if (report.pages) {
    if (report.pages.valueOf() === LayoutErrorType.missing.valueOf())
      fs.writeFileSync(pagesFile(dbDir), "{}");
    else {
      hasUnfixedErrors = true;
      reportAfterFixes.pages = report.pages;
    }
  }
  if (report.events) {
    const pageIds = Object.keys(report.events!);
    pageIds.forEach((pageId) => {
      const error = report.events![pageId]!;
      if (error.valueOf() === LayoutErrorType.missing.valueOf()) {
        fs.writeFileSync(eventFile(dbDir, pageId), "[]");
      } else {
        hasUnfixedErrors = true;
        if (reportAfterFixes.events === undefined) {
          reportAfterFixes.events = {};
        }
        reportAfterFixes.events[pageId] = error;
      }
    });
  }
  return { hasUnfixedErrors, reportAfterFixes };
}

const openDbs: OpenDbs = {
  events: {},
};

function getMetaDb(dbDir: string): LowdbSync<any> {
  if (openDbs.meta) {
    return openDbs.meta;
  }
  const metaDb = Lowdb(new FileSync<AliasDbSchema>(metaFile(dbDir)));
  metaDb.read();
  openDbs.meta = metaDb;
  return metaDb;
}

function getAliasDb(dbDir: string): LowdbSync<AliasDbSchema> {
  if (openDbs.alias) {
    return openDbs.alias;
  }
  const aliasDb = Lowdb(new FileSync<AliasDbSchema>(aliasFile(dbDir)));
  aliasDb.read();
  openDbs.alias = aliasDb;
  return aliasDb;
}

function getPagesDb(dbDir: string): LowdbSync<PagesDbSchema> {
  if (openDbs.pages) {
    return openDbs.pages;
  }
  const pagesDb = Lowdb(new FileSync<PagesDbSchema>(pagesFile(dbDir)));
  pagesDb.read();
  openDbs.pages = pagesDb;
  return pagesDb;
}

function getEventsDb(dbDir: string, pageId: string): LowdbSync<EvensDbSchema> {
  if (openDbs.events![pageId]) {
    return openDbs.events![pageId]!;
  }
  const eventsFile = eventFile(dbDir, pageId);
  const eventsDb = Lowdb(new FileSync<EvensDbSchema>(eventsFile));
  eventsDb.read();
  // If events file is empty, lowdb writes {} by default. We override it for events file.
  const initState = eventsDb.getState();
  if (JSON.stringify(initState) === "{}") {
    eventsDb.setState([]);
    eventsDb.write();
  }
  openDbs.events![pageId] = eventsDb;
  return eventsDb;
}

function deleteEventsDb(dbDir: string, pageId: string) {
  if (openDbs.events![pageId]) {
    delete openDbs.events![pageId];
    const eventsFilename = eventFile(dbDir, pageId);
    if (fs.existsSync(eventsFilename))
      fs.rmSync(path.dirname(eventsFilename), { force: true });
  }
}

function createEventsFile(filePath: string, content: string) {
  if (!fs.existsSync(filePath)) {
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    fs.writeFileSync(filePath, content);
  }
}

export default function createLowDbEventManager(
  options: LowDbEventManagerOptions
): EventManager {
  const dbDir = options.dbDir;

  // create files with default content if file doesn't exists already
  const { hasError, report } = checkFileLayout(dbDir);
  if (hasError) {
    const { hasUnfixedErrors, reportAfterFixes } = fixFileLayout(dbDir, report);
    if (hasUnfixedErrors) {
      console.log(
        "Found errors in lowdb that cannot be fixed automatically\n",
        JSON.stringify(reportAfterFixes, null, 2)
      );
      process.exit(-1);
    }
  }

  const metaDb = getMetaDb(dbDir);

  const pagesDb = getPagesDb(dbDir);

  const aliasDb = getAliasDb(dbDir);

  function meta() {
    return metaDb.getState();
  }

  function updateMeta(data: any) {
    metaDb.setState(data);
  }

  function pages() {
    return pagesDb.getState();
  }

  function createPage(id: Page["id"], name: string, route: string) {
    // do nothing if a page with id Page["id"] already exists
    if (pagesDb.getState()[id]) {
      console.log(
        `Error: Page with id ${id} already exists. Cannot create a new page.`
      );
      return;
    }
    pagesDb.getState()[id] = { name, route };
    const eventsFile = eventFile(dbDir, id);
    createEventsFile(eventsFile, "[]");
  }

  function renamePage(id: Page["id"], name: string) {
    if (!pagesDb.getState()[id]) {
      console.log(`Error: Page with id ${id} does not exist. Cannot rename.`);
      return;
    }
    pagesDb.getState()[id]!["name"] = name;
  }

  function changeRoute(id: Page["id"], route: string) {
    if (!pagesDb.getState()[id]) {
      console.log(
        `Error: Page with id ${id} does not exist. Cannot change route.`
      );
      return;
    }
    pagesDb.getState()[id]!["route"] = route;
  }

  function deletePage(id: Page["id"]) {
    const pages = pagesDb.getState();
    delete pages[id];
    pagesDb.setState(pages);
    deleteEventsDb(dbDir, id);
  }

  function storeEvent(pageId: Page["id"], event: AnyEvent) {
    const eventsDb = getEventsDb(dbDir, pageId);
    eventsDb.getState().push(event);
  }

  function fetchEvents(pageId: Page["id"]): AnyEvent[] {
    // open pages db if not already open
    const eventsDb = getEventsDb(dbDir, pageId);
    return eventsDb.getState();
  }

  function writeBackCompressedEvents(pageId: Page["id"], events: AnyEvent[]) {
    const eventsDb = getEventsDb(dbDir, pageId);
    eventsDb.setState(events);
  }

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

  function createWriteProxy<T extends (...args: any) => any>(fn: T) {
    const proxyFn = new Proxy(fn, {
      apply(target, _thisArg, args) {
        const returnValue = fn(...args);
        // TODO: maybe we should debounce write operation and move it inside a promise as well
        if ([updateMeta].includes(target)) {
          metaDb.write();
        }
        if (
          [createPage, renamePage, changeRoute, deletePage].includes(target)
        ) {
          pagesDb.write();
        }
        if ([incrementAlias].includes(target)) {
          aliasDb.write();
        }
        if ([storeEvent].includes(target)) {
          const eventsDb = getEventsDb(dbDir, args[0]);
          console.log("event db data", eventsDb.getState());
          eventsDb.write();
        }
        return returnValue;
      },
    });
    return proxyFn;
  }

  const api = {
    meta,
    updateMeta,
    pages,
    createPage,
    renamePage,
    changeRoute,
    deletePage,
    storeEvent,
    fetchEvents,
    writeBackCompressedEvents,
    incrementAlias,
  };

  const apiProxy = { ...api };

  Object.keys(apiProxy).forEach((key) => {
    (apiProxy as any)[key] = createWriteProxy((apiProxy as any)[key]);
  });

  return apiProxy;
}
