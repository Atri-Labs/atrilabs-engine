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
  registry: {
    [manifestId: string]: {
      components: ManifestRegistry["0"]["components"]["0"]["component"][];
    };
  };
  pkg: string;
  manifestRegistryController: ManifestRegistryController;
}) {
  const { registry, pkg, manifestRegistryController } = options;
  const manifestIds = Object.keys(registry);
  manifestIds.forEach((manifestId) => {
    const components = registry[manifestId]!.components.map((component) => {
      return { component, pkg };
    });
    manifestRegistryController.writeComponents(manifestId, components);
    console.log(manifestRegistryController.readManifestRegistry());
  });
}
