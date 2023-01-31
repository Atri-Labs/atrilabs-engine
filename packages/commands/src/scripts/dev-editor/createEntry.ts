export async function createEntry() {
  return {
    api: { import: "@atrilabs/core/src/entries/api" },
    BrowserForestManager: {
      import: "@atrilabs/core/src/entries/BrowserForestManager",
    },
    manifestRegistry: {
      import: "@atrilabs/core/src/entries/manifestRegistry",
    },
    registry: { import: "./src/registry" },
    main: { import: "./src/index", dependOn: ["registry"] },
    mainfests: { import: "./src/manifests", dependOn: ["registry"] },
  };
}
