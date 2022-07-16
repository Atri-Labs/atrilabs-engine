const { io } = require("socket.io-client");
const readline = require("readline");

new Promise(() => {
  const socket = io("http://localhost:4004");
  socket.on("connect", () => {
    console.log("connected", socket.connected);
    socket.emit("runTasks", "generate", "deploy", (taskId, taskQueue) => {
      console.log("taskId", taskId);
    });
  });

  socket.on("taskUpdate", (_taskId, num_tasks_left, _taskQueue, taskFailed) => {
    console.log("taskFailed", taskFailed);
    console.log(num_tasks_left);
  });
}).then(() => {});
