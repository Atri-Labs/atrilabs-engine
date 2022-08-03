import { manifestRegistryController } from "@atrilabs/core";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import ReactManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";

export function getFileUploadManifests() {
  const fileUploadManifests: { pkg: string; key: string }[] = [];
  const registry = manifestRegistryController.readManifestRegistry();
  registry[ReactManifestSchemaId].components.forEach((manifest) => {
    const component: ReactComponentManifestSchema = manifest.component;
    if (component.dev.ioProps) {
      Object.keys(component.dev.ioProps).forEach((propName) => {
        Object.keys(component.dev.ioProps![propName]).forEach((key) => {
          const ioProp = component.dev.ioProps![propName][key];
          if (ioProp.mode === "upload" && ioProp.type === "files") {
            fileUploadManifests.push({
              pkg: manifest.pkg,
              key: component.meta.key,
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
  const manifest = registry[ReactManifestSchemaId].components.find(
    (manifest) => {
      const manifestComp = manifest.component as ReactComponentManifestSchema;
      return manifestComp.meta.key === key;
    }
  );
  return manifest?.component as ReactComponentManifestSchema;
}
