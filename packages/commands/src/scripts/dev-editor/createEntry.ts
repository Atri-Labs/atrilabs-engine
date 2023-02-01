export async function createEntry() {
  return {
    api: { import: "@atrilabs/core/src/entries/api" },
    BrowserForestManager: {
      import: "@atrilabs/core/src/entries/BrowserForestManager",
    },
    manifestRegistry: {
      import: "@atrilabs/core/src/entries/manifestRegistry",
    },
    blockRegistry: {
      import: "@atrilabs/core/src/entries/blockRegistry",
    },
    main: {
      import: "./src/index",
      dependOn: [
        "api",
        "BrowserForestManager",
        "manifestRegistry",
        "blockRegistry",
      ],
    },
  };
}
