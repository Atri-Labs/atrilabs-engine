#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { ToolConfig } from "@atrilabs/core";

// this script is expected to be run via npm, yarn
const toolDir = process.cwd();
const toolSrc = path.resolve(toolDir, "src");
const toolConfigFile = path.resolve(toolSrc, "tool.config.js");

// <rootDir>/src/tool.config.(ts|js) should exist
function toolConfigExists() {
  if (fs.existsSync(toolConfigFile)) {
    return true;
  }
  throw Error(`Module Not Found: ${toolConfigFile}`);
}
toolConfigExists();

import(toolConfigFile).then((mod: ToolConfig) => {
  console.log(mod);
});
