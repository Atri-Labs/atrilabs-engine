import { manifestRegistryController, useTree } from "@atrilabs/core";
import { useEffect, useMemo, useState } from "react";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import { getComponentManifest, getFileUploadManifests } from "../utils";
import ReactManifestId from "@atrilabs/react-component-manifests?id";

export const useFileUploadAliases = () => {
  const compTree = useTree(ComponentTreeId);

  // get all components from manifest registry with ioProps field set
  const [fileUploadManifests, setFileUploadManifests] = useState<
    { pkg: string; key: string }[]
  >([]);
  useEffect(() => {
    const fileUploadManifests = getFileUploadManifests();
    setFileUploadManifests(fileUploadManifests);

    manifestRegistryController.subscribe(() => {
      const fileUploadManifests = getFileUploadManifests();
      setFileUploadManifests(fileUploadManifests);
    });
  }, []);

  // get alias of all components with pkg and key in fileUploadManifests
  const fileUploadActions = useMemo(() => {
    const aliases: { alias: string; props: string[] }[] = [];
    const nodeIds = Object.keys(compTree.nodes);
    nodeIds.forEach((nodeId) => {
      const { key, pkg } = compTree.nodes[nodeId].meta;
      const alias: string = compTree.nodes[nodeId].state.alias;
      if (key && pkg && alias) {
        const found = fileUploadManifests.find((manifest) => {
          return manifest.pkg === pkg && manifest.key === key;
        });
        if (found && pkg === ReactManifestId) {
          const manifest = getComponentManifest(found.key);
          Object.keys(manifest.dev.ioProps!).forEach((propName) => {
            Object.keys(manifest.dev.ioProps![propName]!).forEach((key) => {
              aliases.push({ alias, props: [propName, key] });
            });
          });
        }
      }
    });
    return aliases;
  }, [fileUploadManifests, compTree]);

  return { fileUploadActions };
};
