import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";

const server_addr = process.env["ATRI_TOOL_PUBLISH_SERVER_CLIENT"] as string;
const socket = io(server_addr);

export const useRunTask = () => {
  const [inProgress, setInProgress] = useState(false);
  const [numTasksLeft, setNumTasksLeft] = useState<number | null>(null);
  const callRunTaskApi = useCallback(() => {
    if (!inProgress) {
      setInProgress(true);
      socket.emit(
        "runTasks",
        "generate",
        "deploy",
        (taskId: string | null, taskQueue: string[]) => {
          console.log("taskId", taskId);
          if (taskId === null) {
            setInProgress(false);
          } else {
            setNumTasksLeft(taskQueue.length);
          }
        }
      );
    }
  }, [inProgress]);
  // listen for updateTask on socket
  useEffect(() => {
    socket.on(
      "taskUpdate",
      (
        _taskId: string,
        num_tasks_left: number,
        _taskQueue: string[],
        taskFailed?: boolean
      ) => {
        if (taskFailed) {
          setInProgress(false);
          setNumTasksLeft(null);
        } else if (num_tasks_left === 0) {
          setInProgress(false);
          setNumTasksLeft(num_tasks_left);
        } else {
          setNumTasksLeft(num_tasks_left);
        }
        console.log(num_tasks_left);
      }
    );
  }, []);
  return { callRunTaskApi, inProgress, numTasksLeft };
};
