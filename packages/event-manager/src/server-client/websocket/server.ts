import { Server } from "socket.io";
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

io.on("connection", (socket) => {
  socket.on("createFolder", (folder, callback) => {
    console.log(folder);
    callback(true);
  });
});

const port = 4001;
io.listen(port);
