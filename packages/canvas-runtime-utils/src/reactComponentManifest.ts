import { manifestRegistryController } from "@atrilabs/core";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import ReactManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";

export function getReactComponentManifest(key: string) {
  const registry = manifestRegistryController.readManifestRegistry();
  const fullManifest = registry[ReactManifestSchemaId].manifests.find(
    (fullManifest) => {
      const manifest = fullManifest.manifest as ReactComponentManifestSchema;
      return manifest.meta.key === key;
    }
  );
  return fullManifest?.manifest as ReactComponentManifestSchema;
}
