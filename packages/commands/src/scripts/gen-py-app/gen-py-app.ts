#!/usr/bin/env node
import { generatePythonPageModels } from "../../commons/generatePythonPageModels";

async function main() {
  return generatePythonPageModels();
}

main().catch((err) => console.log(err));
