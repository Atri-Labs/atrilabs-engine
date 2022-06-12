#!/usr/bin/env node
import { ToolConfig } from "@atrilabs/core";
import yargs from "yargs";
import { runTargetTask } from "../../shared/runTargetTask";
import { getToolPkgInfo, importToolConfig } from "../../shared/utils";

const args = yargs(process.argv.slice(2))
  .option("task", {
    alias: "t",
    describe: "task to run - generate/build/deploy",
    choices: ["generate", "build", "deploy"],
  })
  .option("target", {
    alias: "o",
    describe: "target name to run",
    type: "string",
  })
  .demandOption(["task", "target"])
  .help().argv;

const toolPkgInfo = getToolPkgInfo();

if (!(args instanceof Promise)) {
  const targetName = args.target;
  const task = args.task as keyof ToolConfig["targets"]["0"]["tasks"];
  importToolConfig(toolPkgInfo.configFile).then((toolConfig) => {
    const target = toolConfig.targets.find(
      (curr) => curr.targetName === targetName
    );
    if (target) runTargetTask(toolConfig, target, task);
    else console.log(`Cannot find target ${targetName} in tool.config.js`);
  });
}
