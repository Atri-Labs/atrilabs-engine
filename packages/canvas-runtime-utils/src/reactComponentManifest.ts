import { manifestRegistryController } from "@atrilabs/core";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import ReactManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";

export function getReactComponentManifest(key: string) {
  const registry = manifestRegistryController.readManifestRegistry();
  const manifest = registry[ReactManifestSchemaId].components.find(
    (manifest) => {
      const manifestComp = manifest.component as ReactComponentManifestSchema;
      return manifestComp.meta.key === key;
    }
  );
  return manifest?.component as ReactComponentManifestSchema;
}
