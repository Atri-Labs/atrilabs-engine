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

io.on("connection", (socket) => {
  socket.on("createFolder", (forestname, folder, callback) => {
    console.log(folder);
    if (eventManagers[forestname]) {
      const meta = eventManagers[forestname]!.meta();
      meta[folder.id] = folder;
      eventManagers[forestname]!.updateMeta(meta);
      callback(true);
    } else {
      callback(false);
    }
  });
});

const port = 4001;
io.listen(port);
