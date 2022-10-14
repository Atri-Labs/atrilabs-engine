import { useCallback, useEffect, useState } from "react";
import { api, BrowserForestManager, useTree } from "@atrilabs/core";
import { subscribeCanvasActivity } from "@atrilabs/canvas-runtime";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import ReactManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";
import { PatchEvent } from "@atrilabs/forest";

export const useShowTab = () => {
  const [showTab, setShowTab] = useState<boolean>(false);
  const tree = useTree(ComponentTreeId);
  const [alias, setAlias] = useState<string>("");
  const [id, setId] = useState<string | null>(null);
  const setAliasCb = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (id) {
        const forestPkgId = BrowserForestManager.currentForest.forestPkgId;
        const forestId = BrowserForestManager.currentForest.forestId;
        const alias = event.target.value.replace(/\s+/g, "_");
        const patchEvent: PatchEvent = {
          type: `PATCH$$${ComponentTreeId}`,
          id,
          slice: {
            alias,
          },
        };
        api.postNewEvents(forestPkgId, forestId, {
          events: [patchEvent],
          meta: {
            agent: "browser",
          },
          name: "ADD_ALIAS",
        });
      }
    },
    [id]
  );
  useEffect(() => {
    const currentForest = BrowserForestManager.currentForest;
    const unsub = currentForest.subscribeForest((update) => {
      if (update.type === "change") {
        const id = update.id;
        if (
          tree.nodes[id] &&
          tree.nodes[id].meta.manifestSchemaId === ReactManifestSchemaId
        ) {
          const alias = tree.nodes[id].state.alias;
          setAlias(alias);
        }
      }
    });
    return unsub;
  }, [tree]);

  useEffect(() => {
    const unsub = subscribeCanvasActivity("select", (context) => {
      const id = context.select!.id;
      if (
        tree.nodes[id] &&
        tree.nodes[id].meta.manifestSchemaId === ReactManifestSchemaId
      ) {
        const alias = tree.nodes[id].state.alias;
        // When a new component is dropped, it is automatically selected, hence, it might
        // be that no alias has been created till now.
        if (alias === undefined) {
          setAlias("");
        } else {
          setAlias(alias);
        }
        setId(id);
        setShowTab(true);
      }
    });
    return unsub;
  }, [tree]);
  useEffect(() => {
    const unsub = subscribeCanvasActivity("selectEnd", (context) => {
      setShowTab(false);
      setId(null);
    });
    return unsub;
  }, []);
  return { showTab, alias, setAliasCb, id };
};
