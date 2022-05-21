/**
 * Default exports from each file goes in here.
 * The expected schema of default export is:
 * {
 *  manifests: {
 *      [manifestId]: component[];
 *  }
 * }
 * The schema validation is expected to be carried out client side.
 * The array is expected to be filled by some automated code before build.
 */
const defaultImports: any[] = [];

function defaultImportsToRegistry() {
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
          manifests[manifestId].components.push(...currManifests[manifestId]);
        } else {
          manifests[manifestId] = { components: currManifests[manifestId] };
        }
      });
    }
  }
  return manifests;
}

export const manifests = defaultImportsToRegistry();
