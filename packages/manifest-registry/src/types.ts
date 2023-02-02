export type ManifestSchema = {
  validate: (manifest: any) => boolean;
};

export type ManifestRegistry = {
  // manifestId of the package containing manifest schema
  // mapped to array of manifests (added after validation)
  [manifestId: string]: {
    schema: ManifestSchema;
    components: { pkg: string; component: any }[];
  };
};
