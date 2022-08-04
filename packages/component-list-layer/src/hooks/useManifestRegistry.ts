import { useState, useEffect, useMemo } from "react";
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

  const categorizedComponents = useMemo(() => {
    const categorizedComponents: {
      [category: string]: {
        pkg: string;
        component: any;
      }[];
    } = {};
    components.forEach(({ pkg, component }) => {
      const reactComp = component.renderSchema;
      if (categorizedComponents[reactComp.meta.category]) {
        categorizedComponents[reactComp.meta.category].push({ pkg, component });
      } else {
        categorizedComponents[reactComp.meta.category] = [{ pkg, component }];
      }
    });
    // sort components in every category
    Object.keys(categorizedComponents).forEach((category) => {
      categorizedComponents[category].sort((a, b) => {
        return a.component.renderSchema.meta.key <
          b.component.renderSchema.meta.key
          ? -1
          : 0;
      });
    });
    return categorizedComponents;
  }, [components]);

  return { components, categorizedComponents };
};
