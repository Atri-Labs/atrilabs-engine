import type { ManifestRegistry, ManifestRegistryController } from "./types";
export * from "./types";

// The object will be filled during build time automatically
// schema will be imported and mapped
// components will be left as empty array to be filled during runtime
declare var manifestRegistry: ManifestRegistry;

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
      manifests: [...manifestRegistry[id].manifests],
    };
  });
  return copy;
}

function writeManifests(
  manifestId: string,
  manifests: ManifestRegistry["0"]["manifests"]
) {
  manifestRegistry[manifestId].manifests = [
    ...manifestRegistry[manifestId].manifests,
    ...manifests,
  ];
  manifestRegistrySubscribers.forEach((cb) => cb());
}

function writeManifestsFromDefaultExport(exports: {
  manifestModule: {
    manifests: {
      [manifestId: string]: any;
    };
  };
  component: React.FC<any>;
  devComponent: React.FC<any>;
  pkg: string;
  icon: React.FC<any>;
}) {
  const { manifestModule, component, devComponent, pkg, icon } = exports;
  const manifestIds = Object.keys(manifestModule.manifests);
  manifestIds.forEach((manifestId) => {
    const manfiests: ManifestRegistry["0"]["manifests"] = [
      {
        pkg,
        component,
        devComponent,
        manifest: manifestModule.manifests[manifestId],
        icon,
      },
    ];
    writeManifests(manifestId, manfiests);
  });
}

export const manifestRegistryController: ManifestRegistryController = {
  readManifestRegistry,
  writeManifests,
  subscribe,
  writeManifestsFromDefaultExport,
};
