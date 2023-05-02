import { manifestRegistryController } from "@atrilabs/core";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import { Id as ReactManifestSchemaId } from "@atrilabs/react-component-manifest-schema";

export function getFileUploadManifests() {
  const fileUploadManifests: { pkg: string; key: string }[] = [];
  const registry = manifestRegistryController.readManifestRegistry();
  registry[ReactManifestSchemaId].manifests.forEach((fullManifest) => {
    const manifest: ReactComponentManifestSchema = fullManifest.manifest;
    if (manifest.dev.ioProps) {
      Object.keys(manifest.dev.ioProps).forEach((propName) => {
        Object.keys(manifest.dev.ioProps![propName]).forEach((key) => {
          const ioProp = manifest.dev.ioProps![propName][key];
          if (ioProp.mode === "upload" && ioProp.type === "files") {
            fileUploadManifests.push({
              pkg: fullManifest.pkg,
              key: manifest.meta.key,
            });
          }
        });
      });
    }
  });
  return fileUploadManifests;
}

export function getComponentManifest(key: string) {
  const registry = manifestRegistryController.readManifestRegistry();
  const fullManifest = registry[ReactManifestSchemaId].manifests.find(
    (fullManifest) => {
      const manifest = fullManifest.manifest as ReactComponentManifestSchema;
      return manifest.meta.key === key;
    }
  );
  return fullManifest?.manifest as ReactComponentManifestSchema;
}
