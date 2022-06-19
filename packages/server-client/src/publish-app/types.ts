export interface ServerToClientEvents {
  taskUpdate: (
    taskId: string,
    num_tasks_left: number,
    taskQueue: string[],
    taskFailed?: boolean
  ) => void;
}

export interface ClientToServerEvents {
  runTasks: (
    startTask: string,
    endTask: string,
    // taskId will be null if invalid request
    cb: (taskId: string | null, taskQueue: string[]) => void
  ) => void;
}

export interface InterServerEvents {}

export interface SocketData {}
