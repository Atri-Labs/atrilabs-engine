#!/usr/bin/env node
import { fork } from "child_process";
import path from "path";

const runEventServerFile = path.resolve(__dirname, "runEventServer.js");

const controller = new AbortController();
const { signal } = controller;

const eventServer = fork(runEventServerFile, [], { signal });
eventServer.on("error", (err) => {
  console.log(`Child exited with error\n${err}`);
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
