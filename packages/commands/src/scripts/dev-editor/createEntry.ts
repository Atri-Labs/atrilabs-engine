export async function createEntry() {
  return {
    api: { import: "@atrilabs/core/src/entries/api" },
    registry: { import: "./src/registry" },
    main: { import: "./src/index", dependOn: ["registry"] },
    mainfests: { import: "./src/manifests", dependOn: ["registry"] },
  };
}
