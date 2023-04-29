import { useCallback, useEffect, useRef, useState } from "react";
import { BrowserForestManager } from "@atrilabs/core";
import { Id as ReactManifestSchemaId } from "@atrilabs/react-component-manifest-schema";
import { Tree } from "@atrilabs/forest";
import {
  subscribeEditorMachine,
  aliasApi,
} from "@atrilabs/pwa-builder-manager";

export const useShowTab = (compTree: Tree) => {
  const [showTab, setShowTab] = useState<boolean>(false);
  const [alias, setAlias] = useState<string>("");
  const initialAlias = useRef<string>("");
  const [id, setId] = useState<string | null>(null);
  const setAliasCb = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (id) {
        const alias = event.target.value.replace(/\s+/g, "_");
        aliasApi.maybeAssignAlias({
          alias,
          id,
          postData: {
            events: [],
            meta: { agent: "browser" },
            name: "SET_ALIAS",
          },
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
    const unsub = subscribeEditorMachine("SELECT", (_context, event) => {
      if (event.type === "SELECT") {
        const id = event.id;
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
      }
    });
    return unsub;
  }, [compTree]);
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
  return {
    showTab,
    alias,
    setAliasCb,
    id,
    initialAlias: initialAlias.current,
  };
};
