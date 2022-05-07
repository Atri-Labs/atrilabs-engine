import { ToolConfig } from "@atrilabs/core";
import { Server } from "socket.io";
import { createForestMgr } from "./create-forest-mgr";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types";

export default function (toolConfig: ToolConfig) {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >();

  // create one directory and event manager for each of forest
  const getEventManager = createForestMgr(toolConfig).getEventManager;

  function getMeta(forestname: string) {
    const meta = getEventManager(forestname)!.meta();
    if (meta["folders"] === undefined) {
      meta["folders"] = { root: { id: "root", name: "/", parentId: "" } };
    }
    if (meta["pages"] === undefined) {
      meta["pages"] = {};
    }
    return meta;
  }

  io.on("connection", (socket) => {
    socket.on("createFolder", (forestname, folder, callback) => {
      console.log(folder);
      if (getEventManager(forestname)) {
        const meta = getMeta(forestname);
        meta["folders"][folder.id] = folder;
        getEventManager(forestname)!.updateMeta(meta);
        callback(true);
      } else {
        callback(false);
      }
    });
    socket.on("createPage", (forestname, page, callback) => {
      if (getEventManager(forestname)) {
        const meta = getMeta(forestname);
        // folder should exist already
        if (meta["folders"][page.folderId]) {
          const foldername = meta["folders"][page.folderId].name;
          // TODO: route must follow the hierarchy of folders, not just the immidiate folder
          const route = `/${foldername}/${page.name}`;
          meta["pages"][page.id] = page.folderId;
          getEventManager(forestname)!.createPage(page.id, page.name, route);
          callback(true);
        } else {
          callback(false);
        }
      }
    });
  });

  const port = 4001;
  io.listen(port);
}
