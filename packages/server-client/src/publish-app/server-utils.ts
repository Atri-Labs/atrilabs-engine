import { Response, Request } from "express";

export function sendInitialResponse(initialMsg: any, response: Response) {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  response.writeHead(200, headers);

  const data = `${JSON.stringify(initialMsg)}`;

  response.write(data);
}

export const GENERATE = "generate";
export const BUILD = "build";
export const DEPLOY = "deploy";
export const taskSequence = [GENERATE, BUILD, DEPLOY];

export function runTaskQueue(
  taskQueue: string[],
  onUpdate: (task: string, status: "success" | "failed") => void
) {
  taskQueue.forEach((task) => {
    onUpdate(task, "success");
  });
}

export function createUpdateHandler(
  req: Request,
  res: Response,
  taskQueueLength: number
) {
  let isRequestClosed = false;
  req.on("close", () => {
    isRequestClosed = true;
  });
  let numTasksCompleted = 0;
  return (task: string, status: "success" | "failed") => {
    if (status === "failed") {
      const data = `${JSON.stringify({
        success: false,
        msg: `${task} failed`,
      })}`;
      if (!isRequestClosed) {
        res.write(data);
        res.end();
      }
    }
    if (status === "success") {
      numTasksCompleted = numTasksCompleted + 1;
      const data = `${JSON.stringify({
        success: true,
        num_tasks_left: taskSequence.length - numTasksCompleted,
      })}`;
      if (!isRequestClosed) {
        res.write(data);
      }
    }
    if (numTasksCompleted === taskQueueLength) {
      res.end();
    }
  };
}
