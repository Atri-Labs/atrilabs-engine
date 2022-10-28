import { ImportedResource, ToolConfig } from "@atrilabs/core";
import { Server } from "socket.io";
import { createForestMgr } from "./create-forest-mgr";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types";
import { reversePageMap } from "./utils";
import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import { compressEvents } from "@atrilabs/forest";

import http from "http";
import {
  createTemplate,
  deleteTemplate,
  getTemplateEvents,
  getTemplateList,
  overwriteTemplate,
} from "./template-handler";
import { fetchCSSResource } from "./resource-handler";
import {
  collectCreatePage,
  collectCreateTemplate,
  collectImportResources,
} from "../utils/collect_stats";
import { getForestDef } from "../utils/getForestDef";
const app = express();
const server = http.createServer(app);

console.log("[websocket_server] projectId", process.env["ATRI_PROJECT_ID"]);

app.use(cors({ origin: "*" }));

export type EventServerOptions = {
  port?: number;
};

export default function (toolConfig: ToolConfig, options: EventServerOptions) {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server, { cors: { origin: "*" }, maxHttpBufferSize: 1e8 });

  // resources management
  const resourseDirectory = path.resolve(toolConfig.resources.path);
  const resourceFile = path.resolve(resourseDirectory, "resources.json");
  if (!fs.existsSync(resourseDirectory)) {
    fs.mkdirSync(resourseDirectory, { recursive: true });
  }
  if (!fs.existsSync(resourceFile)) {
    fs.writeFileSync(resourceFile, "[]");
  }

  // create one directory and event manager for each of forest
  const getEventManager = createForestMgr(toolConfig).getEventManager;
  const assetsDir = toolConfig.assetManager.assetsDir;
  const assetsConfPath = path.join(assetsDir, "assets.config.json");
  const assetUrlPrefix = toolConfig.assetManager.urlPath;
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }
  if (!fs.existsSync(assetsConfPath)) {
    fs.writeFileSync(assetsConfPath, "{}");
  }

  const userTemplateDirs = toolConfig.templateManager.dirs;
  if (userTemplateDirs) {
    userTemplateDirs.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }
  const defaultTemplateDirs = toolConfig.templateManager.defaultDirs;
  if (defaultTemplateDirs) {
    defaultTemplateDirs.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  function getMeta(forestPkgId: string) {
    const eventManager = getEventManager(forestPkgId)!;
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

  function getPages(forestPkgId: string) {
    const eventManager = getEventManager(forestPkgId)!;
    const pages = eventManager.pages();
    if (pages["home"] === undefined) {
      // create home page if not already created
      eventManager.createPage("home", "Home", "/");
    }
    return eventManager.pages();
  }

  // this will ensure that home page is created with proper meta set
  function initialLoadForest(forestPkgId: string) {
    getMeta(forestPkgId);
    getPages(forestPkgId);
  }

  const target = toolConfig.targets[0]!;
  const forestDef = getForestDef(toolConfig, target.options["appForestPkgId"])!;

  io.on("connection", (socket) => {
    if (socket.handshake.auth) {
      console.log(
        "[websocket_server] auth projectId",
        socket.handshake.auth["projectId"]
      );

      if (
        socket.handshake.auth["projectId"] !== process.env["ATRI_PROJECT_ID"]
      ) {
        socket.disconnect();
      }
    }
    socket.on("getMeta", (forestPkgId, callback) => {
      try {
        initialLoadForest(forestPkgId);
        const meta = getMeta(forestPkgId);
        callback(meta);
      } catch (err) {
        console.log(
          `[websocket-server] Following error occured in getMeta message handler`
        );
        console.log(err);
      }
    });
    socket.on("getPages", (forestPkgId, callback) => {
      try {
        initialLoadForest(forestPkgId);
        const pages = getPages(forestPkgId);
        callback(pages);
      } catch (err) {
        console.log(
          `[websocket-server] Following error occured in getPages message handler`
        );
        console.log(err);
      }
    });
    socket.on("createFolder", (forestPkgId, folder, callback) => {
      try {
        if (getEventManager(forestPkgId)) {
          const meta = getMeta(forestPkgId);
          meta["folders"][folder.id] = folder;
          getEventManager(forestPkgId)!.updateMeta(meta);
          callback(true);
        } else {
          callback(false);
        }
      } catch (err) {
        console.log(
          `[websocket-server] Following error occured in createFolder message handler`
        );
        console.log(err);
      }
    });
    socket.on("createPage", (forestPkgId, page, callback) => {
      try {
        collectCreatePage();
        if (getEventManager(forestPkgId)) {
          const meta = getMeta(forestPkgId);
          // folder should exist already
          if (meta["folders"][page.folderId]) {
            const foldername = meta["folders"][page.folderId]!.name;
            // TODO: route must follow the hierarchy of folders, not just the immidiate folder
            let route = `/${foldername}/${page.name}`;
            if (foldername === "/") route = `/${page.name}`;
            meta["pages"][page.id] = page.folderId;
            getEventManager(forestPkgId)!.updateMeta(meta);
            getEventManager(forestPkgId)!.createPage(page.id, page.name, route);
            callback(true);
          } else {
            callback(false);
          }
        }
      } catch (err) {
        console.log(
          `[websocket-server] Following error occured in createPage message handler`
        );
        console.log(err);
      }
    });
    socket.on("updateFolder", (forestPkgId, id, update, callback) => {
      try {
        const eventManager = getEventManager(forestPkgId)!;
        const meta = eventManager.meta();
        if (meta["folders"][id]) {
          meta["folders"][id] = { ...meta["folders"][id]!, ...update };
          eventManager.updateMeta(meta);
          callback(true);
        } else callback(false);
      } catch (err) {
        console.log(
          `[websocket-server] Following error occured in udpateFolder message handler`
        );
        console.log(err);
      }
    });
    socket.on("updatePage", (forestPkgId, id, update, callback) => {
      try {
        const eventManager = getEventManager(forestPkgId)!;
        if (update.folderId) {
          const meta = eventManager.meta();
          meta["pages"][id] = update.folderId;
          eventManager.updateMeta(meta);
        }
        if (update.name) {
          eventManager.renamePage(id, update.name);
          const splittedArr = eventManager.pages()[id]!.route.split("/");
          splittedArr[splittedArr.length - 1] = update.name;
          eventManager.changeRoute(id, splittedArr.join("/"));
        }
        callback(true);
      } catch (err) {
        console.log(
          `[websocket-server] Following error occured in updatePage message handler`
        );
        console.log(err);
      }
    });
    socket.on("deleteFolder", (forestPkgId, id, callback) => {
      try {
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
      } catch (err) {
        console.log(
          `[websocket-server] Following error occured in deleteFolder message handler`
        );
        console.log(err);
      }
    });
    socket.on("deletePage", (forestPkgId, id, callback) => {
      try {
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
      } catch (err) {
        console.log(
          `[websocket-server] Following error occured in deletePage message handler`
        );
        console.log(err);
      }
    });

    socket.on("fetchEvents", (forestPkgId, pageId, callback) => {
      try {
        initialLoadForest(forestPkgId);
        const eventManager = getEventManager(forestPkgId);
        const events = eventManager.fetchEvents(pageId);
        const compressedEvents = compressEvents(events, forestDef);
        callback(compressedEvents);
      } catch (err) {
        console.log(
          `[websocket-server] Following error occured in fetchEvents message handler`
        );
        console.log(err);
      }
    });
    socket.on("postNewEvent", (forestPkgId, pageId, event, callback) => {
      try {
        const eventManager = getEventManager(forestPkgId);
        eventManager.storeEvent(pageId, event);
        callback(true);
        // send this event to all connected sockets
        io.emit("newEvent", forestPkgId, pageId, event, socket.id);
      } catch (err) {
        console.log(
          `[websocket-server] Following error occured in postNewEvent message handler`
        );
        console.log(err);
      }
    });
    socket.on("getNewAlias", (forestPkgId, prefix, callback) => {
      try {
        const eventManager = getEventManager(forestPkgId);
        const index = eventManager.incrementAlias(prefix);
        const alias = `${prefix}${index}`;
        callback(alias);
      } catch (err) {
        console.log(
          `[websocket-server] Following error occured in getNewAlias message handler`
        );
        console.log(err);
      }
    });
    socket.on("uploadAssets", (files, callback) => {
      const returnUrls: string[] = [];
      files.forEach((file) => {
        // dest path should look like /assets/app-assets/a.png
        const destPath = path.join(assetsDir, file.name);
        if (!fs.existsSync(path.dirname(destPath))) {
          fs.mkdirSync(path.dirname(destPath), { recursive: true });
        }
        fs.createWriteStream(destPath).write(file.data);
        // keep a record of assets mime type
        const currentConf = JSON.parse(
          fs.readFileSync(assetsConfPath).toString()
        );
        currentConf[file.name] = { mime: file.mime };
        fs.writeFileSync(assetsConfPath, JSON.stringify(currentConf, null, 2));
        returnUrls.push(encodeURI(`${assetUrlPrefix}/${file.name}`));
      });
      callback(true, returnUrls);
    });
    socket.on("getAssetsInfo", (callback) => {
      const assetConf = JSON.parse(fs.readFileSync(assetsConfPath).toString());
      const names = Object.keys(assetConf);
      names.forEach((name) => {
        assetConf[name] = {
          ...assetConf[name],
          url: encodeURI(`${assetUrlPrefix}/${name}`),
        };
      });
      callback(assetConf);
    });

    socket.on("getTemplateList", (callback) => {
      if (toolConfig.templateManager.dirs?.[0]) {
        const dir = toolConfig.templateManager.dirs[0];
        callback(getTemplateList(dir));
      } else {
        callback([]);
      }
    });
    socket.on(
      "createTemplate",
      (relativeDir, templateName, events, callback) => {
        collectCreateTemplate();
        if (toolConfig.templateManager.dirs?.[0]) {
          const dir = toolConfig.templateManager.dirs[0];
          createTemplate(dir, relativeDir, templateName, events);
          callback(true);
        } else callback(false);
      }
    );
    socket.on(
      "overwriteTemplate",
      (relativeDir, templateName, events, callback) => {
        if (toolConfig.templateManager.dirs?.[0]) {
          const dir = toolConfig.templateManager.dirs[0];
          overwriteTemplate(dir, relativeDir, templateName, events);
          callback(true);
        } else callback(false);
      }
    );
    socket.on("deleteTemplate", (relativeDir, templateName, callback) => {
      if (toolConfig.templateManager.dirs?.[0]) {
        const dir = toolConfig.templateManager.dirs[0];
        deleteTemplate(dir, relativeDir, templateName);
        callback(true);
      } else callback(false);
    });
    socket.on("getTemplateEvents", (relativeDir, templateName, callback) => {
      if (toolConfig.templateManager.dirs?.[0]) {
        const dir = toolConfig.templateManager.dirs[0];
        const events = getTemplateEvents(dir, relativeDir, templateName);
        callback(events || []);
      } else {
        callback([]);
      }
    });

    socket.on("importResource", (resource, cb) => {
      collectImportResources(resource.str);
      fetchCSSResource(resource.str)
        .then((importedResource) => {
          try {
            const fileContent =
              fs.readFileSync(resourceFile).toString() || "[]";
            const importedResources: ImportedResource[] =
              JSON.parse(fileContent);
            if (Array.isArray(importedResources)) {
              importedResources.push(importedResource);
              fs.writeFileSync(
                resourceFile,
                JSON.stringify(importedResources, null, 2)
              );
              cb(true);
              io.sockets.emit("newResource", importedResource);
            } else {
              console.log(
                `The ${resourceFile} is expected to have array of resources. Please check the file.`
              );
              cb(false);
            }
          } catch (err) {
            console.log(err);
            cb(false);
          }
        })
        .catch(() => {
          console.log("Some error occured while fetching CSS resource.");
          cb(false);
        });
    });
    socket.on("getResources", (cb) => {
      if (fs.existsSync(resourceFile)) {
        try {
          const resources = JSON.parse(
            fs.readFileSync(resourceFile).toString()
          );
          if (Array.isArray(resources)) {
            cb(resources);
          }
        } catch {}
      }
    });
  });

  app.use(assetUrlPrefix, express.static(assetsDir));

  const port = (options && options.port) || 4001;
  server.listen(port, () => {
    const address = server.address();
    if (typeof address === "object" && address !== null) {
      let port = address.port;
      let ip = address.address;
      console.log(`[websocket_server] listening on http://${ip}:${port}`);
    } else if (typeof address === "string") {
      console.log(`[websocket_server] listening on http://${address}`);
    } else {
      console.log(`[websocket_server] cannot listen on ${port}`);
    }
  });
}
