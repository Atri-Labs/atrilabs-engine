import { ManifestSchema } from "./types";

// The object will be filled during build time automatically
// schema will be imported and mapped
// components will be left as empty array to be filled during runtime
const manifestRegistry: {
  [manifestId: string]: {
    schema: ManifestSchema;
    components: { pkg: string; component: any }[];
  };
} = {};

const manifestRegistrySubscribers: (() => void)[] = [];

function subscribe(cb: () => void) {
  manifestRegistrySubscribers.push(cb);
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

function writeComponents(manifestId: string, components: []) {
  manifestRegistry[manifestId].components = components;
  manifestRegistrySubscribers.forEach((cb) => cb());
}

export default { readManifestRegistry, writeComponents, subscribe };
