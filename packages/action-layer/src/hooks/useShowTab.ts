import { useCallback, useEffect, useState } from "react";
import { BrowserForestManager, useTree } from "@atrilabs/core";
import ComponentTreeId from "@atrilabs/app-design-forest/src/componentTree?id";
import { Id as ReactManifestSchemaId } from "@atrilabs/react-component-manifest-schema";
import { PatchEvent } from "@atrilabs/forest";
import { api, subscribeEditorMachine } from "@atrilabs/pwa-builder-manager";

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
    const unsub = subscribeEditorMachine("SELECT", (_context, event) => {
      if (event.type === "SELECT") {
        const id = event.id;
        setId(id);
        setShowTab(true);
      }
    });
    return unsub;
  }, []);
  useEffect(() => {
    const unsub = subscribeEditorMachine("SELECT_END", (_context) => {
      setShowTab(false);
      setId(null);
    });
    return unsub;
  }, []);

  useEffect(() => {
    return subscribeEditorMachine("before_app_load", () => {
      setId(null);
    });
  }, []);
  return { showTab, alias, setAliasCb, id };
};
