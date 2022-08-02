// This is the entry file for manifest client during development of compoenents
import type { ManifestRegistry } from "@atrilabs/core";
import { manifestRegistryController } from "@atrilabs/core";

// @ts-ignore
function defaultImportsToRegistry(defaultImports: any[]) {
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

// @ts-ignore
function registerComponents(
  registry: {
    [manifestId: string]: {
      components: ManifestRegistry["0"]["components"]["0"]["component"][];
    };
  },
  pkg: string
) {
  const manifestIds = Object.keys(registry);
  manifestIds.forEach((manifestId) => {
    const components = registry[manifestId]!.components.map((component) => {
      return { component, pkg };
    });
    manifestRegistryController.writeComponents(manifestId, components);
    console.log(manifestRegistryController.readManifestRegistry());
  });
}

/**
 * For reach manifest package, write the following lines using babel plugin:
 *  import module1 from "pkg1";
 *  import module2 from "pkg1";
 *  const pkg1Imports = [module1, module2];
 *  const pkg1Registry = defaultImportsToRegistry(pkg1Imports);
 *  registerComponents(pkg1Registry, "pkg1")
 */
