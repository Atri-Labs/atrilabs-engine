import { ToolConfig } from "@atrilabs/core";
import { exec } from "child_process";
import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../ipc-server/types";

export type IPCClientSocket = Socket<
  ServerToClientEvents,
  ClientToServerEvents
>;

export function createIpcClientSocket(port: number) {
  const ipcClientSocket: IPCClientSocket = io(`http://localhost:${port}`);
  // show error only if publish server is not able to connect to ipc server
  // after 5 seconds. The order in which services get bootstraped
  // cannot be relied upon, hence, we wait some time before reporting error.
  let connectionTimedOut = false;
  setTimeout(() => {
    connectionTimedOut = true;
  }, 5000);
  ipcClientSocket.on("connect_error", (err) => {
    if (connectionTimedOut) console.log("[publish_app_server]", err);
  });
  // on successful connect, emit registerAs
  ipcClientSocket.on("connect", () => {
    console.log("[publish_app_server] connected to ipc server");
    ipcClientSocket.emit("registerAs", "publish-server", (success) => {
      if (success) console.log("[publish_app_server] registered to ipc server");
      else console.log("[publish_app_server] failed to register to ipc server");
    });
  });
  return ipcClientSocket;
}

export const GENERATE = "generate";
export const BUILD = "build";
export const DEPLOY = "deploy";
export const taskSequence = [GENERATE, BUILD, DEPLOY];

export function createTaskQueue(startTask: string, endTask: string) {
  const taskQueue: string[] = [];
  if (startTask && endTask) {
    if (startTask === GENERATE && taskSequence.includes(endTask)) {
      taskQueue.push(...taskSequence.slice(0));
    } else if (startTask === BUILD && taskSequence.slice(1).includes(endTask)) {
      taskQueue.push(...taskSequence.slice(1));
    } else if (
      startTask === DEPLOY &&
      taskSequence.slice(2).includes(endTask)
    ) {
      taskQueue.push(...taskSequence.slice(2));
    }
  }
  return taskQueue;
}

// resolve if task success else reject
type FnQueue = ((
  toolConfig: ToolConfig,
  ipcSocket: IPCClientSocket
) => Promise<void>)[];

async function generateApp(_toolConfig: ToolConfig) {
  return new Promise<void>((res, rej) => {
    exec("yarn run generateApp", (err, _stdout, stderr) => {
      if (err) {
        rej();
        return;
      }
      if (stderr) {
        rej();
        return;
      }
      res();
    });
  });
}

async function buildApp(toolConfig: ToolConfig, socket: IPCClientSocket) {
  const target = toolConfig.targets[0]!;
  import(target.tasksHandler.modulePath).then(async (mod) => {
    if (
      !mod.scripts &&
      typeof mod.scripts.buildReactApp !== "function" &&
      mod.getAppInfo !== "function"
    ) {
      throw Error(
        `The target ${target.targetName} tasksHanler.modulePath doesn't export scripts or getAppInfo correctly.`
      );
    }
    // call getAppInfo
    const appInfo = await mod.getAppInfo(toolConfig, target.options);
    const pages = appInfo.pages;
    const pageIds = Object.keys(pages);
    /**
     * controllerProps[pageId] is defined only if we buildApp succeeds
     * with statusCode 200, otherwise, controllerProps[pageId] is undefined.
     */
    const controllerProps: {
      [pageId: string]: { [alias: string]: any } | undefined;
    } = {};
    pageIds.forEach((pageId) => {
      const route = pages[pageId].route;
      const state = JSON.stringify(pages[pageId].state);
      socket.emit(
        "computeInitialState",
        route,
        state,
        (success, computedState) => {
          if (success) {
            try {
              const resp = JSON.parse(computedState);
              if (resp && resp["statusCode"] === 200)
                controllerProps[pageId] = resp["state"];
            } catch (err) {
              console.log("failed to parse response from computeInitialState");
            }
          } else {
            console.log("computeInitialState failed");
          }
        }
      );
    });
    // call buildApp
    mod.scripts.buildReactApp(toolConfig, {
      ...target.options,
      appInfo,
      controllerProps,
    });
  });
}

async function deployApp() {}

export function runTaskQueue(
  taskQueue: string[],
  toolConfig: ToolConfig,
  ipcSocket: IPCClientSocket,
  onUpdate: (task: string, status: "success" | "failed") => void
) {
  // create function queue
  const fnQueue: FnQueue = [];
  taskQueue.forEach((task) => {
    if (task === GENERATE) {
      fnQueue.push(generateApp);
    }
    if (task === BUILD) {
      fnQueue.push(buildApp);
    }
    if (task === DEPLOY) {
      fnQueue.push(deployApp);
    }
  });

  // run functions one by one
  function runFn(fnQueue: FnQueue, currFnIndex: number) {
    if (currFnIndex < fnQueue.length) {
      fnQueue[currFnIndex]!(toolConfig, ipcSocket)
        .then(() => {
          onUpdate(taskQueue[currFnIndex]!, "success");
          runFn(fnQueue, currFnIndex + 1);
        })
        .catch(() => {
          onUpdate(taskQueue[currFnIndex]!, "failed");
        });
    }
  }
  let currFnIndex = 0;
  runFn(fnQueue, currFnIndex);
}
