import { ToolConfig } from "@atrilabs/core";
import { isPromise } from "util/types";

export function runTargetTask(
  toolConfig: ToolConfig,
  target: ToolConfig["targets"][0],
  task: "generate" | "build" | "deploy"
): Promise<void> {
  switch (task) {
    case "generate":
      return import(target.tasksHandler.modulePath).then((mod) => {
        if (!mod.scripts && typeof mod.scripts.generateApp !== "function") {
          throw Error(
            `The target ${target.targetName} tasksHanler.modulePath doesn't export scripts correctly.`
          );
        }
        const result = mod.scripts.generateApp(toolConfig, target.options);
        if (!isPromise(result)) {
          throw Error(
            `The target ${target.targetName} generate module default function doesn't return a promise`
          );
        }
        return result as Promise<void>;
      });
    case "build":
      return import(target.tasksHandler.modulePath).then((mod) => {
        if (!mod.scripts && typeof mod.scripts.buildReactApp !== "function") {
          throw Error(
            `The target ${target.targetName} tasksHanler.modulePath doesn't export scripts correctly.`
          );
        }
        const result = mod.scripts.buildReactApp(toolConfig, target.options);
        if (!isPromise(result)) {
          throw Error(
            `The target ${target.targetName} build module default function doesn't return a promise`
          );
        }
        return result as Promise<void>;
      });
    case "deploy":
      return import(target.tasksHandler.modulePath).then((mod) => {
        if (!mod.scripts && typeof mod.scripts.deployApp !== "function") {
          throw Error(
            `The target ${target.targetName} tasksHanler.modulePath doesn't export scripts correctly.`
          );
        }
        const result = mod.scripts.deployApp(toolConfig, target.options);
        if (!isPromise(result)) {
          throw Error(
            `The target ${target.targetName} deploy module default function doesn't return a promise`
          );
        }
        return result as Promise<void>;
      });
    default:
      throw Error(`Unknown task type ${task}`);
  }
}
