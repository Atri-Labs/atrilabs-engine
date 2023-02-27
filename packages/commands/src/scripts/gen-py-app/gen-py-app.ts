#!/usr/bin/env node
import {
  dirStructureToIR,
  IRToUnixFilePath,
  readDirStructure,
} from "@atrilabs/atri-app-core";
import { PAGE_DIR, ROUTES_DIR } from "../../consts";
import path from "path";
import fs from "fs";
import { AnyEvent, createForest } from "@atrilabs/forest";
import { componentTreeDef, forestDef } from "./forestDef";
import { generatePythonPageModel } from "../../commons/generatePythonPageModel";

async function main() {
  const filePaths = await readDirStructure(PAGE_DIR);
  const irs = dirStructureToIR(filePaths);
  irs.map((ir) => {
    const unixFilepath = IRToUnixFilePath(ir).replace(/^\//, "");
    const modelPath = path.resolve(ROUTES_DIR, unixFilepath + ".model.py");
    const modelDir = path.dirname(modelPath);
    if (!fs.existsSync(modelDir)) {
      fs.mkdirSync(modelDir, { recursive: true });
    }
    // TODO:
    // create forest from events.json file
    const eventsFilepath = path.resolve(
      PAGE_DIR,
      unixFilepath + ".events.json"
    );
    if (fs.existsSync(eventsFilepath)) {
      const events: AnyEvent[] = JSON.parse(
        fs.readFileSync(eventsFilepath).toString()
      );
      const forest = createForest(forestDef);
      forest.handleEvents({ name: "", events, meta: { agent: "server-sent" } });
      const compNodes = Object.values(forest.tree(componentTreeDef.id)!.nodes);
      const compDefs = compNodes.map((compNode) => {
        // get alias, compKey and nodePkg
        const compKey = compNode.meta.key as string;
        const nodePkg = compNode.meta.pkg as string;
        const alias = compNode.state["alias"] as string;
        // read package.json of nodePkg to get pythonPkg
        // @ts-ignore
        const packageJSON = __non_webpack_require__(nodePkg + "/package.json");
        const pythonPkg = packageJSON["atriConfig"]["pythonPackageName"];
        return { alias, compKey, pythonPkg };
      });
      const modelContent = generatePythonPageModel(compDefs);
      fs.writeFileSync(modelPath, modelContent);
    }
  });
}

main().catch((err) => console.log(err));
