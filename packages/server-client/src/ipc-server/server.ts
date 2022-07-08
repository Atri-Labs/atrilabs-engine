import { ToolConfig } from "@atrilabs/core";
import express from "express";
import { Server } from "socket.io";
import http from "http";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types";
const app = express();
const server = http.createServer(app);

export type IPCServerOptions = {
  port?: number;
};

export default function (_toolConfig: ToolConfig, options: IPCServerOptions) {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    socket.on("computeInitialState", (cb) => {
      socket.emit("doComputeInitialState", (computedState) => {
        cb(computedState);
      });
    });
  });

  const port = (options && options.port) || 4006;
  server.listen(port, () => {
    const address = server.address();
    if (typeof address === "object" && address !== null) {
      let port = address.port;
      let ip = address.address;
      console.log(`[ipc_server] listening on http://${ip}:${port}`);
    } else if (typeof address === "string") {
      console.log(`[ipc_server] listening on http://${address}`);
    } else {
      console.log(`[ipc_server] cannot listen on ${port}`);
    }
  });
}
