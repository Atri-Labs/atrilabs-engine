import { Server } from "socket.io";
import express from "express";
import http from "http";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
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
  socket.on("saveEvent", async (urlPath, event, cb) => {
    const pageInfo = await getMatchedPageInfo(urlPath);
    if (pageInfo) {
      saveEventsForPage(resolvePages(pageInfo.unixFilepath), event);
      cb(true);
    } else {
      cb(false);
    }
  });
});

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
