import yargs from "yargs";
import path from "path";

const args = yargs
  .option("workDir", {
    alias: "w",
    type: "string",
    description: "directory where server will save it's output, logs etc",
    demandOption: true,
  })
  .option("toolConfig", {
    alias: "t",
    type: "string",
    description: "path to the directory containing tool.config.json file",
    demandOption: true,
  })
  .help().argv as {
  [x: string]: unknown;
  workDir: string;
  toolConfig: string;
  _: (string | number)[];
  $0: string;
};

export function getWorkDir() {
  return args["workDir"];
}

export function getToolConfigFile() {
  return path.resolve(args["toolConfig"], "tool.config.js");
}
