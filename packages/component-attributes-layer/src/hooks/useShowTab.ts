import { useEffect, useState } from "react";
import { useTree, manifestRegistryController } from "@atrilabs/core";
import { Id as ComponentTreeId } from "@atrilabs/app-design-forest/src/componentTree";
import { Id as ReactManifestSchemaId } from "@atrilabs/react-component-manifest-schema";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import { subscribeEditorMachine } from "@atrilabs/pwa-builder-manager";

export const useShowTab = () => {
  const [showTab, setShowTab] = useState<boolean>(false);
  const compTree = useTree(ComponentTreeId);
  const [id, setId] = useState<string | null>(null);
  const [treeOptions, setTreeOptions] = useState<
    | ReactComponentManifestSchema["dev"]["attachProps"]["0"]["treeOptions"]
    | null
  >(null);
  useEffect(() => {
    const unsub = subscribeEditorMachine("SELECT", (_context, event) => {
      if (event.type === "SELECT") {
        const id = event.id;
        if (
          compTree.nodes[id] &&
          compTree.nodes[id].meta.manifestSchemaId === ReactManifestSchemaId
        ) {
          const pkg = compTree.nodes[id].meta.pkg;
          const key = compTree.nodes[id].meta.key;
          const manifestRegistry =
            manifestRegistryController.readManifestRegistry();
          const fullManifest = manifestRegistry[
            ReactManifestSchemaId
          ].manifests.find((curr) => {
            return curr.pkg === pkg && curr.manifest.meta.key === key;
          });
          if (fullManifest) {
            const manifest: ReactComponentManifestSchema =
              fullManifest.manifest;
            if (manifest.dev.attachProps["attrs"]) {
              const treeOptions = manifest.dev.attachProps["attrs"].treeOptions;
              setId(id);
              setShowTab(true);
              setTreeOptions(treeOptions);
            }
          }
        }
      }
    });
    return unsub;
  }, [compTree]);
  useEffect(() => {
    const unsub = subscribeEditorMachine("SELECT_END", () => {
      setShowTab(false);
      setId(null);
    });
    return unsub;
  }, []);
  return { showTab, id, treeOptions };
};
