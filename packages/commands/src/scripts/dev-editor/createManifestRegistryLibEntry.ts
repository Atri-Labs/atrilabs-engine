export async function createManifestRegistryLibEntry() {
  return {
    main: {
      import: "@atrilabs/core/src/entries/manifestRegistry",
    },
  };
}
