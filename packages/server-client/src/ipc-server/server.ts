import { ToolConfig } from "@atrilabs/core";
import express from "express";
import { Server } from "socket.io";
import http from "http";
import {
  ClientName,
  ClientSocket,
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
  >(server, {
    cors: { origin: "*" },
    pingTimeout: 60000,
    maxHttpBufferSize: 1e8,
  });

  const clients: { [key in ClientName]?: ClientSocket } = {};

  io.on("connection", (socket) => {
    let clientName: ClientName;
    // the socket need to register itself with a name
    socket.on("registerAs", (incomingClientName, callback) => {
      clientName = incomingClientName;
      clients[clientName] = socket;
      console.log("[ipc_server] client registered:", incomingClientName);
      callback(true);
    });
    socket.on("computeInitialState", (route, pageState, cb) => {
      if (clients["atri-cli"] === undefined) {
        cb(false, "");
      } else {
        const atriCliSocket = clients["atri-cli"]!;
        atriCliSocket.emit(
          "doComputeInitialState",
          route,
          pageState,
          (success, computedState) => {
            cb(success, computedState);
          }
        );
      }
    });
    socket.on("buildPython", (callback) => {
      if (clients["atri-cli"] === undefined) {
        callback(false);
      } else {
        const atriCliSocket = clients["atri-cli"]!;
        atriCliSocket.emit("doBuildPython", (success) => {
          callback(success);
        });
      }
    });
    socket.on("startPythonServer", (callback) => {
      if (clients["atri-cli"] === undefined) {
        callback(-1);
      } else {
        const atriCliSocket = clients["atri-cli"]!;
        atriCliSocket.emit("doStartPythonServer", (returnCode) => {
          callback(returnCode);
        });
      }
    });
    socket.on("disconnect", (reason) => {
      clients[clientName] = undefined;
      console.log("Socket disconnected with reason\n", reason);
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
