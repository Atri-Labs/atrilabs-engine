export type GeneratePageOptions = {
  reload?: boolean;
  paths: { getAppText: string; appDistHtml: string };
};

export type SSGOptions = {
  outputDir: string;
};
