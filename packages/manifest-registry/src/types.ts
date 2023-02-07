export type ManifestSchema = {
  validate: (manifest: any) => boolean;
};

export type ManifestRegistry = {
  // manifestId of the package containing manifest schema
  // mapped to array of manifests (added after validation)
  [manifestId: string]: {
    schema: ManifestSchema;
    manifests: {
      pkg: string;
      manifest: any;
      component: React.FC<any> | null;
      devComponent: React.FC<any> | null;
      icon: React.FC<any> | null;
    }[];
  };
};

export type ManifestRegistryController = {
  readManifestRegistry: () => ManifestRegistry;
  writeManifests: (
    manifestId: string,
    manifests: ManifestRegistry["0"]["manifests"]
  ) => void;
  subscribe: (cb: () => void) => () => void;
  writeManifestsFromDefaultExport: (exports: {
    manifestModule: {
      manifests: {
        [manifestId: string]: any;
      };
    };
    component: React.FC<any>;
    devComponent: React.FC<any>;
    pkg: string;
    icon: React.FC<any>;
  }) => void;
};
