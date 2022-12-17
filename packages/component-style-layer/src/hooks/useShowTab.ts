import { useCallback, useEffect, useRef, useState } from "react";
import { api, BrowserForestManager } from "@atrilabs/core";
import { subscribeCanvasActivity } from "@atrilabs/canvas-runtime";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import ReactManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";
import { PatchEvent, Tree } from "@atrilabs/forest";

export const useShowTab = (compTree: Tree) => {
  const [showTab, setShowTab] = useState<boolean>(false);
  const [alias, setAlias] = useState<string>("");
  const initialAlias = useRef<string>("");
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
          name: "SET_ALIAS",
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
          compTree.nodes[id] &&
          compTree.nodes[id].meta.manifestSchemaId === ReactManifestSchemaId
        ) {
          const alias = compTree.nodes[id].state.alias;
          setAlias(alias);
        }
      }
    });
    return unsub;
  }, [compTree]);

  useEffect(() => {
    const unsub = subscribeCanvasActivity("select", (context) => {
      const id = context.select!.id;
      if (
        compTree.nodes[id] &&
        compTree.nodes[id].meta.manifestSchemaId === ReactManifestSchemaId
      ) {
        const alias = compTree.nodes[id].state.alias;
        // When a new component is dropped, it is automatically selected, hence, it might
        // be that no alias has been created till now.
        if (alias === undefined) {
          setAlias("");
        } else {
          setAlias(alias);
          initialAlias.current = alias;
        }
        setId(id);
        setShowTab(true);
      }
    });
    return unsub;
  }, [compTree]);
  useEffect(() => {
    const unsub = subscribeCanvasActivity("selectEnd", (context) => {
      setShowTab(false);
      setId(null);
    });
    return unsub;
  }, []);
  return {
    showTab,
    alias,
    setAliasCb,
    id,
    initialAlias: initialAlias.current,
  };
};
