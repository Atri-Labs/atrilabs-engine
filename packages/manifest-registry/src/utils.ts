import { ManifestRegistry, ManifestRegistryController } from "./types";

export function defaultImportsToRegistry(defaultImports: any[]) {
  const manifests: { [manifestId: string]: { components: any[] } } = {};
  for (let i = 0; i < defaultImports.length; i++) {
    const defaultImport = defaultImports[i]!;
    if (defaultImport && defaultImport["manifests"]) {
      const currManifests = defaultImport["manifests"];
      const manifestIds = Object.keys(currManifests);
      manifestIds.forEach((manifestId) => {
        if (
          currManifests[manifestId] &&
          !Array.isArray(currManifests[manifestId])
        ) {
          return;
        }
        if (manifests[manifestId]) {
          manifests[manifestId]!.components.push(...currManifests[manifestId]);
        } else {
          manifests[manifestId] = { components: currManifests[manifestId] };
        }
      });
    }
  }
  return manifests;
}

export function registerComponents(options: {
  registry: ManifestRegistry;
  manifestRegistryController: ManifestRegistryController;
}) {
  const { registry, manifestRegistryController } = options;
  const manifestIds = Object.keys(registry);
  manifestIds.forEach((manifestId) => {
    manifestRegistryController.writeManifests(
      manifestId,
      registry[manifestId].manifests
    );
    console.log(manifestRegistryController.readManifestRegistry());
  });
}
