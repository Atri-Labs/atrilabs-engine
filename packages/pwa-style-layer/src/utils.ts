import { BrowserForestManager } from "@atrilabs/core";
import { api } from "@atrilabs/pwa-builder-manager";
import { PatchEvent, UnsetEvent } from "@atrilabs/forest";
import CssTreeId from "@atrilabs/app-design-forest/src/cssTree?id";

export function patchCb(options: {
  selectedId: string;
  propName: string;
  value: string;
}) {
  const { selectedId, propName, value } = options;
  const { forestId, forestPkgId } = BrowserForestManager.currentForest;
  const cssNodeId =
    BrowserForestManager.currentForest.tree(CssTreeId)?.links[selectedId!]
      .childId!;
  const patchEvent: PatchEvent = {
    type: `PATCH$$${CssTreeId}`,
    id: cssNodeId,
    slice: {
      property: {
        styles: {
          [propName]: value,
        },
      },
    },
  };
  api.postNewEvents(forestPkgId, forestId, {
    name: "PATCH",
    events: [patchEvent],
    meta: { agent: "browser" },
  });
}

export function unsetCB(options: { selectedId: string; selector: string[] }) {
  const { selectedId, selector } = options;
  const { forestId, forestPkgId } = BrowserForestManager.currentForest;
  const cssNodeId =
    BrowserForestManager.currentForest.tree(CssTreeId)?.links[selectedId!]
      .childId!;
  const unsetEvent: UnsetEvent = {
    type: `UNSET$$${CssTreeId}`,
    id: cssNodeId,
    selector,
  };
  api.postNewEvents(forestPkgId, forestId, {
    name: "UNSET",
    events: [unsetEvent],
    meta: { agent: "browser" },
  });
}
