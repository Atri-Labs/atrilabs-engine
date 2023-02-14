import { manifestRegistryController } from "@atrilabs/manifest-registry";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import ReactManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";

export function getReactManifest(options: { pkg: string; key: string }) {
  const { pkg, key } = options;
  const registry = manifestRegistryController.readManifestRegistry();
  return registry[ReactManifestSchemaId].manifests.find((curr) => {
    return curr.manifest.meta.key === key && curr.pkg === pkg;
  });
}
