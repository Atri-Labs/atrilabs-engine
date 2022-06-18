import { ToolConfig } from "@atrilabs/core";
import express, { response } from "express";
import cors from "cors";
import {
  sendInitialResponse,
  GENERATE,
  BUILD,
  DEPLOY,
  taskSequence,
  runTaskQueue,
  createUpdateHandler,
} from "./server-utils";

export type PublishServerOptions = {
  port?: number;
};

export default function startPublishServer(
  _toolConfig: ToolConfig,
  options: PublishServerOptions
) {
  const app = express();
  app.use(cors({ origin: "*" }));

  /**
   * The resposne sent is of format {success: boolean, msg?: string, num_tasks_left?: number}
   */
  app.get("/run-tasks", (req, res) => {
    const startTask = req.query["startTask"] as string;
    const endTask = req.query["endTask"] as string;
    // create a task queue
    const taskQueue: string[] = [];
    if (startTask && endTask) {
      if (startTask === GENERATE && taskSequence.includes(endTask)) {
        taskQueue.push(...taskSequence.slice(0));
        // send initial response with keepAlive header set
        sendInitialResponse(
          { success: true, num_tasks_left: taskQueue.length },
          response
        );
      } else if (
        startTask === BUILD &&
        taskSequence.slice(1).includes(endTask)
      ) {
        taskQueue.push(...taskSequence.slice(1));
      } else if (
        startTask === DEPLOY &&
        taskSequence.slice(2).includes(endTask)
      ) {
        taskQueue.push(...taskSequence.slice(2));
      } else {
        sendInitialResponse({ success: false, msg: "bad request" }, res);
        res.end();
        return;
      }
      // task queue is prepared, run it
      runTaskQueue(taskQueue, createUpdateHandler(req, res, taskQueue.length));
    } else {
      sendInitialResponse({ success: false, msg: "bad request" }, res);
      res.end();
    }
  });

  const port = options.port || 4004;
  const server = app.listen(port, () => {
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
