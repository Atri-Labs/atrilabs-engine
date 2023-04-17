import { BrowserForestManager } from "@atrilabs/core";
import { breakpointApi } from "./breakpointApi";
import ComponentTreeId from "@atrilabs/app-design-forest/src/componentTree?id";
import { editorAppMachineInterpreter } from "./init";
import { createComponentFromNode } from "@atrilabs/atri-app-core/src/utils/createComponentFromNode";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import { manifestRegistryController } from "@atrilabs/manifest-registry";

function processComponentManifests() {
  const componentManifests: {
    [pkg: string]: {
      [key: string]: { manifest: ReactComponentManifestSchema };
    };
  } = {};
  const manifestRegistry = manifestRegistryController.readManifestRegistry();
  manifestRegistry[
    "@atrilabs/react-component-manifest-schema/src/index.ts"
  ].manifests.forEach((manifest) => {
    const pkg = manifest.pkg;
    const key = manifest.manifest.meta.key;
    if (componentManifests[pkg] === undefined) {
      componentManifests[pkg] = {};
    }
    componentManifests[pkg][key] = {
      manifest: manifest.manifest,
    };
  });
  return componentManifests;
}

let componentManifests = processComponentManifests();

manifestRegistryController.subscribe(() => {
  componentManifests = processComponentManifests();
});

breakpointApi.subscribeBreakpointChange(() => {
  const compTree = BrowserForestManager.currentForest.tree(ComponentTreeId);
  if (compTree) {
    const compIds = Object.keys(compTree.nodes);
    const compDatas = compIds.map((compId) => {
      const node = compTree.nodes[compId];
      const componentData = createComponentFromNode(
        node,
        BrowserForestManager.currentForest,
        componentManifests
      );
      return componentData;
    });
    compDatas.forEach((compData) => {
      if (compData?.props) {
        editorAppMachineInterpreter.machine.context.canvasWindow?.postMessage(
          { type: "UPDATE_PROPS", payload: compData },
          // @ts-ignore
          "*"
        );
      }
    });
  }
});
