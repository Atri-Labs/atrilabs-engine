export type ServerInfo = {
  pages: { [route: string]: { name: string } };
  publicDir: string;
  publicUrlAssetMap: {
    [route: string]: string;
  };
  organizationName?: string;
  projectName?: string;
  deploymentBranch?: string;
  githubHost?: string;
  githubPort?: string;
  static?: string;
};

export type GeneratePageOptions = {
  reload?: boolean;
  paths: { getAppText: string; appDistHtml: string };
};

export type SSGOptions = {
  outputDir: string;
};
