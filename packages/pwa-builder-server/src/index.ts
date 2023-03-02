import { Server } from "socket.io";
import express from "express";
import http from "http";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  ImportedResource,
} from "@atrilabs/core";
import {
  getAppInfo,
  getMatchedPageInfo,
  getPagesInfo,
  getProjectInfo,
  loadEventsForPage,
  resolvePages,
  saveEventsForPage,
} from "./utils";
import { saveAssets, getAllAssetsInfo, PUBLIC_DIR } from "./handleAssets";
import fs from "fs";
import {
  createCSSFile,
  fetchCSSFromFile,
  fetchCSSResource,
  getResourceFiles,
} from "./handle-resources";

const app = express();
const server = http.createServer(app);

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, { cors: { origin: "*" }, maxHttpBufferSize: 1e8 });

io.on("connection", (socket) => {
  socket.on("getProjectInfo", (cb) => {
    const projectInfo = getProjectInfo();
    cb(projectInfo);
  });
  socket.on("getAppInfo", (cb) => {
    const appInfo = getAppInfo();
    cb(appInfo);
  });
  socket.on("getPagesInfo", async (cb) => {
    const pagesInfo = await getPagesInfo();
    cb(pagesInfo);
  });
  socket.on("fetchEvents", async (urlPath, cb) => {
    const pageInfo = await getMatchedPageInfo(urlPath);
    if (pageInfo) {
      const events = loadEventsForPage(resolvePages(pageInfo.unixFilepath));
      cb(JSON.parse(events.toString()));
    }
  });
  socket.on("saveEvents", async (urlPath, events, cb) => {
    const pageInfo = await getMatchedPageInfo(urlPath);
    if (pageInfo) {
      saveEventsForPage(resolvePages(pageInfo.unixFilepath), events);
      cb(true);
    } else {
      cb(false);
    }
  });
  socket.on("uploadAssets", (files, cb) => {
    saveAssets(files)
      .then((urls) => {
        cb(true, urls);
      })
      .catch((err) => {
        cb(false, []);
        console.log(err);
      });
  });
  socket.on("getAssetsInfo", (cb) => {
    getAllAssetsInfo()
      .then((info) => {
        cb(info);
      })
      .catch((err) => {
        cb({});
        console.log(err);
      });
  });
  socket.on("importResource", (resource, cb) => {
    fetchCSSResource(resource.str)
      .then((importedResource) => {
        try {
          createCSSFile(resource.str);
          io.sockets.emit("newResource", importedResource);
          cb(true);
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
    getResourceFiles()
      .then((files) => {
        const promises = files
          .filter((file) => file.endsWith(".css"))
          .map((file) => fetchCSSFromFile(file));
        return Promise.all(promises);
      })
      .then((resources) => {
        cb(resources);
      })
      .catch((err) => {
        console.log(err);
        cb([]);
      });
  });
});

app.use(express.static(PUBLIC_DIR));

const port = process.env["PORT"] ? parseInt(process.env["PORT"]) : 4000;
const host = process.env["HOST"] ? process.env["HOST"] : "0.0.0.0";

server.listen(port, host, () => {
  const address = server.address();
  if (typeof address === "object" && address !== null) {
    let port = address.port;
    let ip = address.address;
    console.log(`[pwa-builder-server] listening on http://${ip}:${port}`);
  } else if (typeof address === "string") {
    console.log(`[pwa-builder-server] listening on http://${address}`);
  } else {
    console.log(`[pwa-builder-server] cannot listen on ${port}`);
  }
});
