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

export function runTaskQueue(
  taskQueue: string[],
  onUpdate: (task: string, status: "success" | "failed") => void
) {
  taskQueue.forEach((task) => {
    onUpdate(task, "success");
  });
}
