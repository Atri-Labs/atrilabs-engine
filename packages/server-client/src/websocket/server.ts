import { Server } from "socket.io";
import { createEventManager } from "./create-event-manager";
import { readForests } from "./read-forest";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types";

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>();

// load forest config
const forests = readForests();

// create one directory and event manager for each of forest
const eventManagers = createEventManager(forests);

function getMeta(forestname: string) {
  const meta = eventManagers[forestname]!.meta();
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
    if (eventManagers[forestname]) {
      const meta = getMeta(forestname);
      meta["folders"][folder.id] = folder;
      eventManagers[forestname]!.updateMeta(meta);
      callback(true);
    } else {
      callback(false);
    }
  });
  socket.on("createPage", (forestname, page, callback) => {
    if (eventManagers[forestname]) {
      const meta = getMeta(forestname);
      // folder should exist already
      if (meta["folders"][page.folderId]) {
        const foldername = meta["folders"][page.folderId].name;
        // TODO: route must follow the hierarchy of folders, not just the immidiate folder
        const route = `/${foldername}/${page.name}`;
        meta["pages"][page.id] = page.folderId;
        eventManagers[forestname]!.createPage(page.id, page.name, route);
        callback(true);
      } else {
        callback(false);
      }
    }
  });
});

const port = 4001;
io.listen(port);
