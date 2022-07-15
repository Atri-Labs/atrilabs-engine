import { ToolConfig } from "@atrilabs/core";
import { ChildProcess, exec } from "child_process";
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
  console.log("[publish_app_server] generate app called");
  return new Promise<void>((res, rej) => {
    const child_proc = exec("yarn run generateApp", (err, stdout, stderr) => {
      if (err) {
        console.log("[publish_app_server] Generate app error\n", err);
      }
      if (stderr) {
        console.log("[publish_app_server] Generate app stderr\n", stderr);
      }
      if (stdout) {
        console.log("[publish_app_server] Generate app stdout\n", stdout);
      }
      if (child_proc.exitCode != 0) {
        console.log("[publish_app_server] return code", child_proc.exitCode);
        rej();
      } else {
        res();
      }
    });
  });
}

function convertPropsIntoPythonFormat(pageStates: any, pageId: string) {
  const pageState = pageStates[pageId];
  const aliases = Object.keys(pageState);
  const formattedState: { [alias: string]: any } = {};
  aliases.forEach((alias) => {
    formattedState[alias] = pageState[alias]["props"];
  });
  return formattedState;
}

function buildApp(toolConfig: ToolConfig, socket: IPCClientSocket) {
  console.log("[publish_app_server] emitting buildPython");
  return new Promise<void>((res, rej) => {
    socket.emit("buildPython", (success) => {
      if (success) {
        console.log("python build success");
        const target = toolConfig.targets[0]!;
        import(target.tasksHandler.modulePath)
          .then(async (mod) => {
            if (
              !mod.scripts &&
              typeof mod.scripts.buildReactApp !== "function" &&
              mod.getAppInfo !== "function"
            ) {
              throw Error(
                `The target ${target.targetName} tasksHandler.modulePath doesn't export scripts or getAppInfo correctly.`
              );
            }
            // call getAppInfo
            const appInfo = await mod.getAppInfo(toolConfig, target.options);
            const pages = appInfo.pages;
            const pageIds = Object.keys(pages);
            const pageStates = mod.getPageStateAsAliasMap(appInfo);
            /**
             * controllerProps[pageId] is defined only if we buildApp succeeds
             * with statusCode 200, otherwise, controllerProps[pageId] is undefined.
             */
            const controllerProps: {
              [pageId: string]: { [alias: string]: any } | undefined;
            } = {};
            const promises = pageIds.map((pageId) => {
              return new Promise<void>((resolve) => {
                const route = pages[pageId].route;
                const state = JSON.stringify(
                  convertPropsIntoPythonFormat(pageStates, pageId)
                );
                socket.emit(
                  "computeInitialState",
                  route,
                  state,
                  (success, computedState) => {
                    if (success) {
                      try {
                        const resp = JSON.parse(computedState);
                        if (resp && resp["statusCode"] === 200) {
                          controllerProps[pageId] = resp["state"];
                        }
                      } catch (err) {
                        console.log(
                          "[publish_app_server]failed to parse response from computeInitialState"
                        );
                      }
                    } else {
                      console.log(
                        "[publish_app_server]computeInitialState failed"
                      );
                    }
                    resolve();
                  }
                );
              });
            });
            Promise.all(promises).then(() => {
              // call buildApp
              mod.scripts
                .buildReactApp(toolConfig, {
                  ...target.options,
                  appInfo,
                  controllerProps,
                })
                .then(() => {
                  res();
                })
                .catch((err: any) => {
                  console.log(
                    "[publish_app_server] Error while calling buildReactApp\n",
                    err
                  );
                  rej(err);
                });
            });
          })
          .catch((err) => rej(err));
      } else {
        console.log("python build failed");
        rej();
      }
    });
  });
}

let devProc: ChildProcess;
let devServerProc: ChildProcess;
const devControllers: AbortController[] = [];
async function deployApp(toolConfig: ToolConfig, socket: IPCClientSocket) {
  const target = toolConfig.targets[0]!;
  const outputDir = target.options["outputDir"];
  if (!outputDir && typeof outputDir !== "string") {
    console.log(
      "[publish_app_server]Schema of tool.config.js must contain targets[0].options.outputDir"
    );
    return;
  }
  if (devProc === undefined) {
    const controller = new AbortController();
    const { signal } = controller;
    devControllers.push(controller);
    devProc = exec("yarn run dev", { cwd: outputDir, signal });
    devProc.on("error", (err) => {
      if (err.name !== "AbortError") {
        console.log("[dev] Process Error\n", err);
      }
    });
    devProc.stdout?.on("data", (data) => {
      console.log("[dev]\n", data);
    });
    devProc.stderr?.on("data", (data) => {
      console.log("[dev] Error\n", data);
    });
  }
  if (devServerProc === undefined) {
    const controller = new AbortController();
    const { signal } = controller;
    devControllers.push(controller);
    devServerProc = exec("yarn run devServer", { cwd: outputDir, signal });
    devServerProc.on("error", (err) => {
      if (err.name !== "AbortError") {
        console.log("[devServer] Process Error\n", err);
      }
    });
    devServerProc.stdout?.on("data", (data) => {
      console.log("[devServer]\n", data);
    });
    devServerProc.stderr?.on("data", (data) => {
      console.log("[devServer] Error\n", data);
    });
  }
  // wait for kill signals
  ["SIGINT", "SIGTERM"].forEach(function (sig) {
    process.on(sig, function () {
      devControllers.forEach((controller) => {
        controller.abort();
      });
      process.exit();
    });
  });

  // wait for input on stdin (hold the terminal)
  process.stdin.on("end", function () {
    devControllers.forEach((controller) => {
      controller.abort();
    });
    process.exit();
  });

  socket.emit("startPythonServer", (success) => {
    if (!success) console.log("failed to start python server");
  });
}

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
