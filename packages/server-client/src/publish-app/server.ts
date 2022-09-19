import { ToolConfig } from "@atrilabs/core";
import {
  runTaskQueue,
  createTaskQueue,
  createIpcClientSocket,
  watchControllersDir,
} from "./server-utils";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "./types";
import http from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { collectPublish } from "../utils/collect_stats";

const server = http.createServer();

export type PublishServerOptions = {
  port?: number;
};

export default function startPublishServer(
  toolConfig: ToolConfig,
  options: PublishServerOptions
) {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server, { cors: { origin: "*" } });

  const ipcClientSocket = createIpcClientSocket(
    toolConfig["services"]["ipcServer"].options.port || 4006
  );

  watchControllersDir(toolConfig, ipcClientSocket);

  io.on("connection", (socket) => {
    console.log("[PUBLISH_SERVER] Socket connected", socket.id);
    socket.on("disconnect", () => {
      console.log("[PUBLISH_SERVER] Socket Disconnected", socket.id);
    });
    socket.on("runTasks", (startTask, endTask, cb) => {
      console.log("[PUBLISH_SERVER]runTasks received");

      collectPublish();

      const taskQueue = createTaskQueue(startTask, endTask);
      // check if task request is invalid
      if (taskQueue.length === 0) {
        cb(null, taskQueue);
        return;
      }
      const taskId = uuidv4();
      cb(taskId, taskQueue);
      let num_tasks_completed = 0;
      runTaskQueue(taskQueue, toolConfig, ipcClientSocket, (task, status) => {
        console.log("task queue callback called for task", task, status);
        if (status === "success") {
          num_tasks_completed += 1;
          socket.emit(
            "taskUpdate",
            taskId,
            taskQueue.length - num_tasks_completed,
            taskQueue
          );
        } else {
          // a task failed
          socket.emit(
            "taskUpdate",
            taskId,
            taskQueue.length - num_tasks_completed,
            taskQueue,
            true
          );
        }
      });
    });
  });

  const port = options.port || 4004;
  server.listen(port, () => {
    const address = server.address();
    if (typeof address === "object" && address !== null) {
      let port = address.port;
      let ip = address.address;
      console.log(`[publish_app_server] listening on http://${ip}:${port}`);
    } else if (typeof address === "string") {
      console.log(`[publish_app_server] listening on http://${address}`);
    } else {
      console.log(`[publish_app_server] cannot listen on ${port}`);
    }
  });
}
