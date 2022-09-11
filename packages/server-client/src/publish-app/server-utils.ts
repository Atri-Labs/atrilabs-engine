import { ToolConfig } from "@atrilabs/core";
import { ChildProcess, fork } from "child_process";
import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../ipc-server/types";
import path from "path";
import chokidar from "chokidar";

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

export async function invokeGenerateApp() {
  return new Promise<void>((res, rej) => {
    // TODO: Should we run it by importing the generate module
    // like in buildApp function below?
    const generateAppScriptPath = require.resolve(
      "@atrilabs/scripts/build/tasks/run-target/index.js"
    );
    const child_proc = fork(generateAppScriptPath, [
      "--task",
      "generate",
      "--target",
      "Web App",
    ]);
    child_proc.on("close", (code) => {
      console.log("[server-utils] generateApp received code", code);
      if (code === 0) res();
      else rej();
    });
    child_proc.on("error", (err) => {
      console.log("[server-utils] generateApp err\n", err);
      rej();
    });
  });
}

async function generateApp(_toolConfig: ToolConfig) {
  console.log("[publish_app_server] generate app called");
  return invokeGenerateApp();
}

export function convertPropsIntoPythonFormat(pageStates: any, pageId: string) {
  const pageState = pageStates[pageId];
  const aliases = Object.keys(pageState);
  const formattedState: { [alias: string]: any } = {};
  aliases.forEach((alias) => {
    formattedState[alias] = pageState[alias]["props"];
  });
  return formattedState;
}

export async function invokeGetAppInfo(toolConfig: ToolConfig) {
  const target = toolConfig.targets[0]!;
  // TODO: Should we fork a process from @atrilabs/scripts instead of importing
  // like in the generateApp function above?
  return import(target.tasksHandler.modulePath).then(async (mod) => {
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
    return { appInfo, pageIds, pageStates };
  });
}

export async function invokeBuildReactApp(
  toolConfig: ToolConfig,
  appInfo: any,
  controllerProps: {
    [pageId: string]: { [alias: string]: any } | undefined;
  }
) {
  const target = toolConfig.targets[0]!;
  // TODO: Should we fork a process from @atrilabs/scripts instead of importing
  // like in the generateApp function above?
  return import(target.tasksHandler.modulePath).then(async (mod) => {
    if (
      !mod.scripts &&
      typeof mod.scripts.buildReactApp !== "function" &&
      mod.getAppInfo !== "function"
    ) {
      throw Error(
        `The target ${target.targetName} tasksHandler.modulePath doesn't export scripts or getAppInfo correctly.`
      );
    }
    // call buildReactApp
    return mod.scripts.buildReactApp(toolConfig, {
      ...target.options,
      appInfo,
      controllerProps,
    });
  });
}

function buildApp(toolConfig: ToolConfig, socket: IPCClientSocket) {
  console.log("[publish_app_server] emitting buildPython");
  return new Promise<void>((res, rej) => {
    socket.emit("buildPython", (success) => {
      if (success) {
        console.log("python build success");
        invokeGetAppInfo(toolConfig)
          .then(({ appInfo, pageIds, pageStates }) => {
            const controllerProps: {
              [pageId: string]: { [alias: string]: any } | undefined;
            } = {};
            const promises = pageIds.map((pageId) => {
              return new Promise<void>((resolve) => {
                const route = appInfo.pages[pageId].route;
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
              invokeBuildReactApp(toolConfig, appInfo, controllerProps)
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
    const watchServerPath = path.resolve(
      outputDir,
      "node_modules/@atrilabs/app-scripts/lib/tasks/start-dev-server.js"
    );
    try {
      devProc = fork(watchServerPath, {
        signal,
        cwd: outputDir,
        stdio: ["pipe", "pipe", "pipe", "ipc"],
      });
    } catch (err) {
      console.log("Error while starting watch server for app\n", err);
    }
    devProc.on("error", (err) => {
      if (err.name !== "AbortError") {
        console.log("[dev] Process Error\n", err);
      }
    });
    devProc.stdout?.on("data", (data) => {
      console.log("[dev]\n", data.toString());
    });
    devProc.stderr?.on("data", (data) => {
      console.log("[dev] Error\n", `${data}`);
    });
  }
  if (devServerProc === undefined) {
    const controller = new AbortController();
    const { signal } = controller;
    devControllers.push(controller);
    const appServerScriptPath = path.resolve(outputDir, "dist/server/index.js");
    try {
      devServerProc = fork(appServerScriptPath, ["--dev"], {
        signal,
        cwd: outputDir,
        stdio: ["pipe", "pipe", "pipe", "ipc"],
      });
    } catch (err) {
      console.log("Error while starting dev server for app\n", err);
    }
    devServerProc.on("error", (err) => {
      if (err.name !== "AbortError") {
        console.log("[devServer] Process Error\n", err);
      }
    });
    devServerProc.stdout?.on("data", (data) => {
      console.log("[devServer]\n", data.toString());
    });
    devServerProc.stderr?.on("data", (data) => {
      console.log("[devServer] Error\n", `${data}`);
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

export function watchControllersDir(
  toolConfig: ToolConfig,
  socket: IPCClientSocket
) {
  // watch python controllers
  if (
    toolConfig.targets[0] &&
    toolConfig.targets[0].options &&
    toolConfig.targets[0].options.controllers &&
    toolConfig.targets[0].options.controllers["python"] &&
    toolConfig.targets[0].options.controllers["python"]["dir"]
  ) {
    const pythonControllersDir =
      toolConfig.targets[0]?.options.controllers["python"]["dir"];

    // watch only main.py files in routes directory
    const watcher = chokidar.watch(
      path.join(pythonControllersDir, "routes") + "/**/*"
    );
    watcher.on("change", (path) => {
      if (path.match("main.py")) {
        console.log("Change in main.py file:", path);
        buildApp(toolConfig, socket);
      }
    });
  }
}
