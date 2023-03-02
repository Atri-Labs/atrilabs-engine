#!/usr/bin/env node

import prompts from "prompts";
import { exec } from "child_process";
import path from "path";
import pkgUp from "pkg-up";

async function collectPrompts() {
  const response = await prompts([
    {
      type: "text",
      name: "projectName",
      message: "Give a name to your project directory",
    },
    {
      type: "select",
      name: "language",
      message: "Choose the language for your frontend code",
      choices: [
        { title: "JavaScript", value: "JavaScript" },
        { title: "TypeScript", value: "TypeScript" },
      ],
    },
    {
      type: "text",
      name: "author",
      message: "Author's name & email (Ex. John <john@example.com>)",
    },
    {
      type: "text",
      name: "description",
      message: "Description of your project",
    },
  ]);
  return response;
}

async function main() {
  const { projectName, language, author, description } = await collectPrompts();
  const commandsSrcDir = path.dirname(
    // @ts-ignore
    __non_webpack_require__.resolve("@atrilabs/commands")
  );
  const commandsDir = path.dirname(pkgUp.sync({ cwd: commandsSrcDir })!);
  const createAtriAppJS = path.resolve(
    commandsDir,
    "dist",
    "create-atri-app.js"
  );
  exec(
    `node ${createAtriAppJS} -n ${projectName} -a ${author} -d ${description} ${
      language === "TypeScript" ? "--typescript" : ""
    }`,
    (err, stdout, stderr) => {
      if (err) {
        console.log(err);
      }
      if (stdout) {
        console.log(stdout);
      }
      if (stderr) {
        console.log(stderr);
      }
    }
  );
}

main().catch(console.log);
