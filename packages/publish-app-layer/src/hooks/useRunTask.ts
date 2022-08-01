import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";

const server_addr = process.env["ATRI_TOOL_PUBLISH_SERVER_CLIENT"] as string;
const socket = io(server_addr);

export const useRunTask = () => {
  const [inProgress, setInProgress] = useState(false);
  const [lastRunStatus, setLastRunStatus] = useState<{
    generate: boolean;
    build: boolean;
    deploy: boolean;
  } | null>(null);
  const [status, setStatus] = useState({
    generate: false,
    build: false,
    deploy: false,
  });
  const callRunTaskApi = useCallback(() => {
    if (!inProgress) {
      setInProgress(true);
      setStatus({ generate: false, build: false, deploy: false });
      socket.emit(
        "runTasks",
        "generate",
        "deploy",
        (taskId: string | null, taskQueue: string[]) => {
          console.log("taskId", taskId);
          if (taskId === null) {
            setInProgress(false);
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
        const status = { generate: false, build: false, deploy: false };
        if (num_tasks_left === 3) {
          setStatus(status);
        }
        if (num_tasks_left === 2) {
          status.generate = true;
          setStatus(status);
        }
        if (num_tasks_left === 1) {
          status.generate = true;
          status.build = true;
          setStatus(status);
        }
        // task can either complete or fail
        if (num_tasks_left === 0) {
          setInProgress(false);
          status.generate = true;
          status.build = true;
          status.deploy = true;
          setStatus(status);
          setLastRunStatus(status);
        }
        if (taskFailed) {
          setInProgress(false);
          setStatus(status);
          setLastRunStatus(status);
        }
      }
    );
  }, []);
  return { callRunTaskApi, inProgress, lastRunStatus, status };
};
