import { ManifestRegistry } from "./types";

// The object will be filled during build time automatically
// schema will be imported and mapped
// components will be left as empty array to be filled during runtime
const manifestRegistry: ManifestRegistry = {};

const manifestRegistrySubscribers: (() => void)[] = [];

function subscribe(cb: () => void) {
  manifestRegistrySubscribers.push(cb);
  return () => {
    const index = manifestRegistrySubscribers.findIndex((curr) => {
      return curr === cb;
    });
    if (index >= 0) {
      manifestRegistrySubscribers.splice(index, 1);
    }
  };
}

function readManifestRegistry() {
  const manifestIds = Object.keys(manifestRegistry);
  const copy = { ...manifestRegistry };
  manifestIds.forEach((id) => {
    copy[id] = {
      schema: { ...manifestRegistry[id].schema },
      components: [...manifestRegistry[id].components],
    };
  });
  return copy;
}

function writeComponents(
  manifestId: string,
  components: ManifestRegistry["0"]["components"]
) {
  manifestRegistry[manifestId].components = components;
  manifestRegistrySubscribers.forEach((cb) => cb());
}

export const manifestRegistryController = {
  readManifestRegistry,
  writeComponents,
  subscribe,
};
