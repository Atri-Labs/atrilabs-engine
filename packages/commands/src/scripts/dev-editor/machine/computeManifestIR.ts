import { readDirStructure } from "@atrilabs/atri-app-core";
import { ManifestIR } from "@atrilabs/core";
import {
  createServerMachineInterpreter,
  FS_CHANGED,
  MANIFEST_OBJECTS_UPDATED,
} from "./editorServerMachine";
import pkgUp from "pkg-up";

function searchDevComponent(
  dirStructureSet: Set<string>,
  componentName: string
) {
  if (dirStructureSet.has(componentName + ".dev.js")) {
    return componentName + ".dev.js";
  }
  if (dirStructureSet.has(componentName + ".dev.jsx")) {
    return componentName + ".dev.jsx";
  }
  if (dirStructureSet.has(componentName + ".dev.ts")) {
    return componentName + ".dev.ts";
  }
  if (dirStructureSet.has(componentName + ".dev.tsx")) {
    return componentName + ".dev.tsx";
  }
  return undefined;
}

function computeComponentName(manifestFile: string) {
  return manifestFile.replace(/(.manifest.(ts|tsx|js|jsx))$/, "");
}

function computeManifestIR(
  manifestFile: string,
  dirStructureSet: Set<string>,
  pkg: string
) {
  const componentName = computeComponentName(manifestFile);

  const devComponentFile = searchDevComponent(dirStructureSet, componentName);

  let componentFilename: string | undefined = undefined;
  if (dirStructureSet.has(componentName + ".js")) {
    componentFilename = componentName + ".js";
  }
  if (dirStructureSet.has(componentName + ".jsx")) {
    componentFilename = componentName + ".jsx";
  }
  if (dirStructureSet.has(componentName + ".ts")) {
    componentFilename = componentName + ".ts";
  }
  if (dirStructureSet.has(componentName + ".tsx")) {
    componentFilename = componentName + ".tsx";
  }
  if (componentFilename !== undefined) {
    return {
      manifest: manifestFile,
      component: componentFilename,
      devComponent: devComponentFile,
      pkg,
    };
  }
  return undefined;
}

async function computeManifestIRs(dir: string) {
  // @ts-ignore
  const pkg = __non_webpack_require__(pkgUp.sync(dir))["name"];
  const dirStructure = await readDirStructure(dir);
  const manifestFiles = dirStructure.filter((filename) => {
    return (
      filename.endsWith(".manifest.ts") ||
      filename.endsWith(".manifest.js") ||
      filename.endsWith(".manifest.tsx") ||
      filename.endsWith(".manifest.jsx")
    );
  });
  // for fast lookup
  const dirStructureSet = new Set(dirStructure);
  const manifestIRs: ManifestIR[] = [];
  manifestFiles.forEach((manifestFile) => {
    const manifestIR = computeManifestIR(manifestFile, dirStructureSet, pkg);
    if (manifestIR) manifestIRs.push(manifestIR);
  });
  return manifestIRs;
}

export async function computeManifestIRsForDirs(dirs: string[]) {
  const manifestIRsDoubleArray = await Promise.all(
    dirs.map((dir) => computeManifestIRs(dir))
  );
  return manifestIRsDoubleArray.flat();
}

export async function computeFSAndSend(
  editorServerMachineInterpreter: ReturnType<
    typeof createServerMachineInterpreter
  >,
  dirs: string[]
) {
  editorServerMachineInterpreter.send({ type: FS_CHANGED });
  const irs = await computeManifestIRsForDirs(dirs);
  editorServerMachineInterpreter.send({
    type: MANIFEST_OBJECTS_UPDATED,
    manifests: irs,
  });
}
