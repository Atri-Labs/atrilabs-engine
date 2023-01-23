export async function createNodeEntry() {
  // TODO: add pages when they are requested
  return {
    index: { import: "./pages/index" },
    _error: { import: "./pages/_error" },
  };
}
