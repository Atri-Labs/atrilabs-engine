#!/usr/bin/env node
import chalk from "chalk";
import yargs from "yargs";
import path from "path";
import fs from "fs";

process.on("unhandledRejection", (reason) => {
  console.log(chalk.red(`create-atri-app failed with reason\n ${reason}`));
});

function processArgs() {
  return yargs
    .option("name", {
      alias: "n",
      default: "my_app",
      description: "name of the app",
    })
    .option("author", { alias: "a", default: "", description: "name <email>" })
    .option("description", {
      alias: "d",
      default: "",
      description: "describe the app",
    })
    .boolean("typescript").argv as {
    name: string;
    author: string;
    description: string;
    typescript: boolean;
  };
}

function createAppDirectory(dest: string) {
  if (fs.existsSync(dest)) {
    console.log(chalk.red(`A directory at ${dest} already exists.`));
    process.exit(1);
  }
  fs.mkdirSync(dest);
}

function createPackageJSON(
  data: {
    name: string;
    author: string;
    description: string;
  },
  options: { dest: string }
) {
  const str = JSON.stringify(data, null, 2);
  const fullPath = path.resolve(options.dest, "package.json");
  if (fs.existsSync(fullPath)) {
    console.log(
      chalk.red(
        `A package.json file at ${path.resolve(options.dest)} already exists.`
      )
    );
    process.exit(1);
  }
  fs.writeFileSync(fullPath, str);
}

function createPageScaffold() {
  return [`export default function(){`, ``, `}`].join("\n");
}

function createPagesDirectory(options: {
  dest: string;
  useTypescript: boolean;
}) {
  const { dest, useTypescript } = options;
  const fullPath = path.resolve(dest, "pages");
  if (fs.existsSync(fullPath)) {
    console.log(
      chalk.red(`A pages directory at ${path.resolve(dest)} already exists.`)
    );
    process.exit(1);
  }
  fs.mkdirSync(fullPath);

  const indexPagePath = `${path.resolve(
    fullPath,
    "index" + (useTypescript ? ".tsx" : ".jsx")
  )}`;
  fs.writeFileSync(indexPagePath, createPageScaffold());
}

function main() {
  const args = processArgs();
  const dirname = args.name.startsWith("@")
    ? args.name.split("/")[1]
    : args.name;
  if (dirname === undefined) {
    console.log(
      chalk.red(`The directory name must be a valid npm package name.`)
    );
    process.exit(1);
  }
  const dest = path.resolve(dirname);
  createAppDirectory(dest);
  createPackageJSON(args, { dest });
  createPagesDirectory({ dest, useTypescript: args.typescript });
}

main();
