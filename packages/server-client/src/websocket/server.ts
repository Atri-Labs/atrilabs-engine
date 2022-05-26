import { ToolConfig } from "@atrilabs/core";
import { Server } from "socket.io";
import { createForestMgr } from "./create-forest-mgr";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types";
import { reversePageMap } from "./utils";

export type EventServerOptions = {
  port?: number;
};

export default function (toolConfig: ToolConfig, options: EventServerOptions) {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >({ cors: { origin: "*" } });

  // create one directory and event manager for each of forest
  const getEventManager = createForestMgr(toolConfig).getEventManager;

  function getMeta(forestname: string) {
    const eventManager = getEventManager(forestname)!;
    const meta = eventManager.meta();
    // a flag to indicate update of meta
    let initMeta = false;
    if (meta["folders"] === undefined) {
      meta["folders"] = { root: { id: "root", name: "/", parentId: "" } };
      initMeta = true;
    }
    if (meta["pages"] === undefined) {
      // make home a direct child of root
      meta["pages"] = { home: "root" };
      initMeta = true;
    }
    if (meta["pages"] && meta["pages"]["home"] !== "root") {
      meta["pages"]["home"] = "root";
      initMeta = true;
    }
    if (initMeta) {
      eventManager.updateMeta(meta);
    }
    return meta;
  }

  function getPages(forestname: string) {
    const eventManager = getEventManager(forestname)!;
    const pages = eventManager.pages();
    if (pages["home"] === undefined) {
      // create home page if not already created
      eventManager.createPage("home", "Home", "");
    }
    return eventManager.pages();
  }

  io.on("connection", (socket) => {
    socket.on("getMeta", (forestPkgId, callback) => {
      const meta = getMeta(forestPkgId);
      // pre-call getPages to do a first time setup if needed
      getPages(forestPkgId);
      callback(meta);
    });
    socket.on("getPages", (forestPkgId, callback) => {
      const pages = getPages(forestPkgId);
      callback(pages);
    });
    socket.on("createFolder", (forestPkgId, folder, callback) => {
      console.log(folder);
      if (getEventManager(forestPkgId)) {
        const meta = getMeta(forestPkgId);
        meta["folders"][folder.id] = folder;
        getEventManager(forestPkgId)!.updateMeta(meta);
        callback(true);
      } else {
        callback(false);
      }
    });
    socket.on("createPage", (forestPkgId, page, callback) => {
      if (getEventManager(forestPkgId)) {
        const meta = getMeta(forestPkgId);
        // folder should exist already
        if (meta["folders"][page.folderId]) {
          const foldername = meta["folders"][page.folderId]!.name;
          // TODO: route must follow the hierarchy of folders, not just the immidiate folder
          const route = `/${foldername}/${page.name}`;
          meta["pages"][page.id] = page.folderId;
          getEventManager(forestPkgId)!.createPage(page.id, page.name, route);
          callback(true);
        } else {
          callback(false);
        }
      }
    });
    socket.on("updateFolder", (forestPkgId, id, update, callback) => {
      const eventManager = getEventManager(forestPkgId)!;
      const meta = eventManager.meta();
      if (meta["folders"][id]) {
        meta["folders"][id] = { ...meta["folders"][id]!, ...update };
        eventManager.updateMeta(meta);
        callback(true);
      } else callback(false);
    });
    socket.on("updatePage", (forestPkgId, id, update, callback) => {
      const eventManager = getEventManager(forestPkgId)!;
      if (update.folderId) {
        const meta = eventManager.meta();
        meta["pages"][id] = update.folderId;
        eventManager.updateMeta(meta);
      }
      if (update.name) {
        eventManager.renamePage(id, update.name);
      }
      callback(true);
    });
    socket.on("deleteFolder", (forestPkgId, id, callback) => {
      const eventManager = getEventManager(forestPkgId)!;
      const meta = eventManager.meta();
      const folders = meta["folders"];
      if (folders[id]) {
        // delete from meta.json
        const pageMap = meta["pages"];
        const pageMapRev = reversePageMap(pageMap);
        if (pageMapRev[id]) {
          const pages = pageMapRev[id];
          pages?.forEach((page) => {
            delete meta["pages"][page];
          });
        }
        delete meta["folders"][id];
        eventManager.updateMeta(meta);
        // delete file events/xxx-pageid.json
        eventManager.deletePage(id);
        callback(true);
      } else {
        callback(false);
      }
    });
    socket.on("deletePage", (forestPkgId, id, callback) => {
      const eventManager = getEventManager(forestPkgId)!;
      const meta = eventManager.meta();
      if (meta["pages"][id]) {
        delete meta["pages"][id];
        eventManager.updateMeta(meta);
        eventManager.deletePage(id);
        callback(true);
      } else {
        callback(false);
      }
    });

    socket.on("fetchEvents", (forestPkgId, pageId, callback) => {
      const eventManager = getEventManager(forestPkgId);
      const events = eventManager.fetchEvents(pageId);
      callback(events);
    });
    socket.on("postNewEvent", (forestPkgId, pageId, event, callback) => {
      const eventManager = getEventManager(forestPkgId);
      eventManager.storeEvent(pageId, event);
      callback(true);
      // send this event to all connected sockets
      io.emit("newEvent", forestPkgId, pageId, event, socket.id);
    });
  });

  const port = (options && options.port) || 4001;
  io.listen(port);
}
