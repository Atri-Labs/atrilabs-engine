import { useState, useEffect } from "react";
import { manifestRegistryController } from "@atrilabs/core";
import ComponetIconManifestId from "@atrilabs/component-icon-manifest-schema?id";

export const useManifestRegistry = () => {
  const [components, setComponents] = useState(
    manifestRegistryController.readManifestRegistry()[ComponetIconManifestId]
      .components
  );
  useEffect(() => {
    const unsub = manifestRegistryController.subscribe(() => {
      setComponents(
        manifestRegistryController.readManifestRegistry()[
          ComponetIconManifestId
        ].components
      );
    });
    return unsub;
  }, []);
  return components;
};
