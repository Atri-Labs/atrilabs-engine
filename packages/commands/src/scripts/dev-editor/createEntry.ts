export async function createEntry() {
  return {
    registry: { import: "./src/registry" },
    main: { import: "./src/index", dependOn: ["registry"] },
    mainfests: { import: "./src/manifests", dependOn: ["registry"] },
  };
}
