import { ToolConfig } from "@atrilabs/core";
import { isPromise } from "util/types";

export function runTargetTask(
  toolConfig: ToolConfig,
  target: ToolConfig["targets"][0],
  task: keyof ToolConfig["targets"][0]["tasks"]
): Promise<void> {
  switch (task) {
    case "generate":
      return import(target.tasks.generate.path).then((mod) => {
        if (!mod.default && typeof mod.default !== "function") {
          throw Error(
            `The target ${target.targetName} generate module doesn't export a default function`
          );
        }
        const result = mod.default(toolConfig, target.tasks.generate.options);
        if (!isPromise(result)) {
          throw Error(
            `The target ${target.targetName} generate module default function doesn't return a promise`
          );
        }
        return result as Promise<void>;
      });
    case "build":
      return import(target.tasks.build.path).then((mod) => {
        if (!mod.default && typeof mod.default !== "function") {
          throw Error(
            `The target ${target.targetName} build module doesn't export a default function`
          );
        }
        const result = mod.default(toolConfig, target.tasks.build.options);
        if (!isPromise(result)) {
          throw Error(
            `The target ${target.targetName} build module default function doesn't return a promise`
          );
        }
        return result as Promise<void>;
      });
    case "deploy":
      return import(target.tasks.deploy.path).then((mod) => {
        if (!mod.default && typeof mod.default !== "function") {
          throw Error(
            `The target ${target.targetName} deploy module doesn't export a default function`
          );
        }
        const result = mod.default(toolConfig, target.tasks.deploy.options);
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
