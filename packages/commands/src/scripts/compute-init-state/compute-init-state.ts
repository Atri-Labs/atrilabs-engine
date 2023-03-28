#!/usr/bin/env node

import { callCompute } from "../../commons/callCompute";
import yargs from "yargs";

const args = yargs
  .option("r", { alias: "route", default: "/", type: "string" })
  .option("s", { alias: "state", default: "{}", type: "string" }).argv as {
  r: string;
  s: string;
};

function main() {
  callCompute(args.r, JSON.stringify(args.s));
}

main();
