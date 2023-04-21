import {
  dirStructureToIR,
  IRToUnixFilePath,
  PathIR,
  readDirStructure,
} from "@atrilabs/atri-app-core/src/utils";
import { PAGE_DIR, ROUTES_DIR } from "../consts";
import path from "path";
import fs from "fs";
import { AnyEvent, createForest, TreeNode } from "@atrilabs/forest";
import { componentTreeDef, forestDef } from "../scripts/gen-py-app/forestDef";
import { generatePythonPageModel } from "./generatePythonPageModel";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import { ComponentTypes } from "./types";
import pkgUp from "pkg-up";

export function generatePythonModelForAPage(ir: PathIR) {
  const unixFilepath = IRToUnixFilePath(ir).replace(/^\//, "");
  const modelPath = path.resolve(ROUTES_DIR, unixFilepath + "_model.py");
  const modelDir = path.dirname(modelPath);
  if (!fs.existsSync(modelDir)) {
    fs.mkdirSync(modelDir, { recursive: true });
  }
  // create forest from events.json file
  const eventsFilepath = path.resolve(PAGE_DIR, unixFilepath + ".events.json");
  const events: AnyEvent[] = fs.existsSync(eventsFilepath)
    ? JSON.parse(fs.readFileSync(eventsFilepath).toString())
    : [];
  const forest = createForest(forestDef);
  forest.handleEvents({ name: "", events, meta: { agent: "server-sent" } });
  const compNodes = Object.values(forest.tree(componentTreeDef.id)!.nodes);
  const reverseMap: { [parentId: string]: TreeNode[] } = {};
  compNodes.forEach((compNode) => {
    if (reverseMap[compNode.state.parent.id] === undefined) {
      reverseMap[compNode.state.parent.id] = [];
    }
    reverseMap[compNode.state.parent.id]!.push(compNode);
  });
  const nodePkgManifestMap: {
    [nodePkg: string]: { [compKey: string]: ReactComponentManifestSchema };
  } = {};
  // @ts-ignore
  const localPackageJSON = __non_webpack_require__(path.resolve(pkgUp.sync()!));
  const localPkgName = localPackageJSON["name"];
  const compDefs = compNodes.map((compNode) => {
    // get alias, compKey and nodePkg
    const compKey = compNode.meta.key as string;
    const nodePkg = compNode.meta.pkg as string;
    const alias = compNode.state["alias"] as string;
    const isLocalPkg = localPkgName === nodePkg;
    // read package.json of nodePkg to get pythonPkg
    const packageJSON = isLocalPkg
      ? localPackageJSON
      : // @ts-ignore
        __non_webpack_require__(nodePkg + "/package.json");
    const pythonPkg = packageJSON["atriConfig"]["pythonPackageName"];
    // create reverseMap to create a list of children alias
    const childrenAlias: string[] = reverseMap[compNode.id]
      ? reverseMap[compNode.id]!.map((node) => node.state["alias"])
      : [];
    // read manifest to detect component type
    if (nodePkgManifestMap[nodePkg] === undefined) {
      try {
        const manifestsBundle = isLocalPkg
          ? // @ts-ignore
            __non_webpack_require__(path.resolve("dist", "manifests.bundle.js"))
          : // @ts-ignore
            __non_webpack_require__(nodePkg + "/dist/manifests.bundle.js");

        nodePkgManifestMap[nodePkg] = {};
        manifestsBundle.default.forEach(
          (obj: {
            fullManifest: {
              manifests: {
                ["@atrilabs/react-component-manifest-schema/src/index.ts"]: ReactComponentManifestSchema;
              };
            };
          }) => {
            const componentManifest =
              obj.fullManifest.manifests[
                "@atrilabs/react-component-manifest-schema/src/index.ts"
              ];
            nodePkgManifestMap[nodePkg]![componentManifest.meta.key] =
              componentManifest;
          }
        );
      } catch (err) {
        console.log(
          "Error while importing manifests bundle for package",
          nodePkg
        );
        console.error(err);
        process.exit(2);
      }
    }
    const componentType: ComponentTypes = nodePkgManifestMap[nodePkg]![compKey]!
      .dev.isRepeating
      ? "repeating"
      : nodePkgManifestMap[nodePkg]![compKey]!.dev.acceptsChild
      ? "parent"
      : "normal";
    return { alias, compKey, pythonPkg, childrenAlias, componentType };
  });
  const modelContent = generatePythonPageModel(compDefs);
  fs.writeFileSync(modelPath, modelContent);
}

export async function generatePythonPageModels() {
  if (!fs.existsSync(PAGE_DIR)) {
    console.log("Please create a pages directory.");
    process.exit(1);
  }
  const filePaths = await readDirStructure(PAGE_DIR);
  const irs = dirStructureToIR(filePaths);
  irs.map((ir) => {
    generatePythonModelForAPage(ir);
  });
}
