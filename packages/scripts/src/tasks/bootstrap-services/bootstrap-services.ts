#!/usr/bin/env node
import { fork } from "child_process";
import path from "path";

function startEventServer() {
  const runEventServerFile = path.resolve(__dirname, "runEventServer.js");
  const controller = new AbortController();
  const { signal } = controller;
  const eventServer = fork(runEventServerFile, [], { signal });
  eventServer.on("error", (err) => {
    if (!err.toString().match("AbortError"))
      console.log(`Event Server exited with error\n${err}`);
  });
  return controller;
}

function startFileServer() {
  const fileServerFile = path.resolve(__dirname, "runFileServer.js");
  const controller = new AbortController();
  const { signal } = controller;
  const fileServer = fork(fileServerFile, [], { signal });
  fileServer.on("error", (err) => {
    if (!err.toString().match("AbortError"))
      console.log(`File Server exited with error\n${err}`);
  });
  return controller;
}

function startManifestServer() {
  const manifestServerFile = path.resolve(__dirname, "runManifestServer.js");
  const controller = new AbortController();
  const { signal } = controller;
  const manifestServer = fork(manifestServerFile, [], { signal });
  manifestServer.on("error", (err) => {
    if (!err.toString().match("AbortError"))
      console.log(`Manifest Server exited with error\n${err}`);
  });
  return controller;
}

const controllers = [
  startEventServer(),
  startFileServer(),
  startManifestServer(),
];

// wait for kill signals
["SIGINT", "SIGTERM"].forEach(function (sig) {
  process.on(sig, function () {
    controllers.forEach((controller) => {
      controller.abort();
    });
    process.exit();
  });
});

// wait for input on stdin (hold the terminal)
process.stdin.on("end", function () {
  controllers.forEach((controller) => {
    controller.abort();
  });
  process.exit();
});
