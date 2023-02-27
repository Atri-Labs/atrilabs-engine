#!/usr/bin/env node
import {
  dirStructureToIR,
  IRToUnixFilePath,
  readDirStructure,
} from "@atrilabs/atri-app-core";
import { PAGE_DIR, ROUTES_DIR } from "../../consts";
import path from "path";
import fs from "fs";

async function main() {
  const filePaths = await readDirStructure(PAGE_DIR);
  const irs = dirStructureToIR(filePaths);
  irs.map((ir) => {
    const unixFilepath = IRToUnixFilePath(ir);
    const modelPath = path.resolve(
      ROUTES_DIR,
      unixFilepath.replace(/^\//, "") + ".model.py"
    );
    const modelDir = path.dirname(modelPath);
    if (!fs.existsSync(modelDir)) {
      fs.mkdirSync(modelDir, { recursive: true });
    }
    // TODO:
    // create forest from events.json file
    // get alias, compKey and nodePkg
    // read package.json of nodePkg to get pythonPkg
    fs.writeFileSync(modelPath, "");
  });
}

main().catch((err) => console.log(err));
