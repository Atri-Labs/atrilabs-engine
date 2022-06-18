import { useCallback, useState } from "react";

const server_addr = process.env["ATRI_TOOL_PUBLISH_SERVER_CLIENT"] as string;

export const useRunTask = () => {
  const [inProgress, setInProgress] = useState(false);
  const [numTasksLeft, setNumTasksLeft] = useState<number | null>(null);
  const callRunTaskApi = useCallback(() => {
    if (!inProgress) {
      const endpoint = `${server_addr}/run-tasks?startTask=generate&endTask=deploy`;
      const eventSource = new EventSource(endpoint);
      eventSource.onmessage = (event) => {
        if (eventSource.readyState === eventSource.CLOSED) {
          console.log("connection close");
          setInProgress(false);
          setNumTasksLeft(null);
        }
        console.log(event);
      };
      eventSource.onerror = (_err) => {
        setInProgress(false);
        setNumTasksLeft(null);
        eventSource.close();
      };
      setInProgress(true);
      setNumTasksLeft(3);
    }
  }, [inProgress]);
  return { callRunTaskApi, inProgress, numTasksLeft };
};
