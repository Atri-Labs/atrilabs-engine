import { ToolConfig } from "@atrilabs/core";
import { exec } from "child_process";

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
type FnQueue = ((toolConfig: ToolConfig) => Promise<void>)[];

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

async function buildApp(toolConfig: ToolConfig) {
  /**
   * call getAppInfo
   * for each page, do:
   *  try {
   *    get new props from ipc-server
   *    if statusCode === 200 and state from the ipc response
   *  } catch(err){
   *    use old props from app info
   *  }
   * prepare buildOptions from new props and appInfo
   * run build
   */
}

async function deployApp() {}

export function runTaskQueue(
  taskQueue: string[],
  toolConfig: ToolConfig,
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
      fnQueue[currFnIndex]!(toolConfig)
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
