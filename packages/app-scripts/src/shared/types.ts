export type ServerInfo = {
  pages: { [route: string]: { name: string } };
  publicDir: string;
};

export type GeneratePageOptions = {
  reload?: boolean;
  paths: { getAppText: string; appDistHtml: string };
};

export type SSGOptions = {
  outputDir: string;
};
