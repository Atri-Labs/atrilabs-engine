import path from "path";
import { fork } from "child_process";

export function buildSSG() {
  try {
    const buildSSGScriptPath = path.resolve(
      "node_modules/@atrilabs/app-scripts/lib/tasks/build-ssg.js"
    );
    const controller = new AbortController();
    const { signal } = controller;
    try {
      const proc = fork(buildSSGScriptPath, {
        signal,
        stdio: ["pipe", "pipe", "pipe", "ipc"],
      });
      proc.on("error", (err) => {
        if (err.name !== "AbortError") {
          console.log("Process Error\n", err);
        }
      });
      proc.stdout?.on("data", (data) => {
        console.log(data.toString());
      });
      proc.stderr?.on("data", (data) => {
        console.log("Error\n", `${data}`);
      });

      // wait for kill signals
      ["SIGINT", "SIGTERM"].forEach(function (sig) {
        process.on(sig, function () {
          controller.abort();
          process.exit();
        });
      });

      // wait for input on stdin (hold the terminal)
      process.stdin.on("end", function () {
        controller.abort();
        process.exit();
      });
    } catch (err) {
      console.log("Error while starting watch server for app\n", err);
    }
  } catch (err) {
    console.log("[Error in SSG build]\n", err);
  }
}

export function deployGithubPages() {
  try {
    const buildSSGScriptPath = path.resolve(
      "node_modules/@atrilabs/app-scripts/lib/tasks/deploy-ssg.js"
    );
    const controller = new AbortController();
    const { signal } = controller;
    try {
      const proc = fork(buildSSGScriptPath, {
        signal,
        stdio: ["pipe", "pipe", "pipe", "ipc"],
      });
      proc.on("error", (err) => {
        if (err.name !== "AbortError") {
          console.log("Process Error\n", err);
        }
      });
      proc.stdout?.on("data", (data) => {
        console.log(data.toString());
      });
      proc.stderr?.on("data", (data) => {
        console.log("Error\n", `${data}`);
      });

      // wait for kill signals
      ["SIGINT", "SIGTERM"].forEach(function (sig) {
        process.on(sig, function () {
          controller.abort();
          process.exit();
        });
      });

      // wait for input on stdin (hold the terminal)
      process.stdin.on("end", function () {
        controller.abort();
        process.exit();
      });
    } catch (err) {
      console.log("Error while starting watch server for app\n", err);
    }
  } catch (err) {
    console.log("[Error in SSG build]\n", err);
  }
}

export function startBootstrapServices() {
  try {
    const bootStrapScriptPath = require.resolve(
      "@atrilabs/scripts/build/tasks/bootstrap-services/bootstrap-services.js"
    );
    require(bootStrapScriptPath);
  } catch (err) {
    console.log("[Error in running app]\n", err);
  }
}
