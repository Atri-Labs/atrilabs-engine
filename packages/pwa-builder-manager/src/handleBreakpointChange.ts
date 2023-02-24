import { BrowserForestManager, createComponentFromNode } from "@atrilabs/core";
import { breakpointApi } from "./breakpointApi";
import ComponentTreeId from "@atrilabs/app-design-forest/src/componentTree?id";
import { editorAppMachineInterpreter } from "./init";

breakpointApi.subscribeBreakpointChange(() => {
  const compTree = BrowserForestManager.currentForest.tree(ComponentTreeId);
  if (compTree) {
    const compIds = Object.keys(compTree.nodes);
    const compDatas = compIds.map((compId) => {
      const node = compTree.nodes[compId];
      const componentData = createComponentFromNode(
        node,
        breakpointApi.getActiveBreakpoint()
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
