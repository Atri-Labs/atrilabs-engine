import { useState, useEffect, useMemo } from "react";
import { manifestRegistryController } from "@atrilabs/core";
import { Id as ComponetIconManifestId } from "@atrilabs/component-icon-manifest-schema";

export const useManifestRegistry = () => {
  const [fullManifests, setFullManifests] = useState(
    manifestRegistryController.readManifestRegistry()[ComponetIconManifestId]
      .manifests
  );
  useEffect(() => {
    const unsub = manifestRegistryController.subscribe(() => {
      setFullManifests(
        manifestRegistryController.readManifestRegistry()[
          ComponetIconManifestId
        ].manifests
      );
    });
    return unsub;
  }, []);

  const categorizedComponents = useMemo(() => {
    const categorizedComponents: {
      [category: string]: {
        pkg: string;
        manifest: any;
        icon: React.FC<any> | null;
      }[];
    } = {};
    fullManifests.forEach(({ pkg, manifest, icon }) => {
      const reactComp = manifest.renderSchema;
      if (categorizedComponents[reactComp.meta.category]) {
        categorizedComponents[reactComp.meta.category].push({
          pkg,
          manifest,
          icon,
        });
      } else {
        categorizedComponents[reactComp.meta.category] = [
          { pkg, manifest, icon },
        ];
      }
    });
    // sort components in every category
    Object.keys(categorizedComponents).forEach((category) => {
      categorizedComponents[category].sort((a, b) => {
        return a.manifest.renderSchema.meta.key <
          b.manifest.renderSchema.meta.key
          ? -1
          : 0;
      });
    });
    return categorizedComponents;
  }, [fullManifests]);

  return { fullManifests, categorizedComponents };
};
