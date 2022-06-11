export type AppGeneratorOptions = {
  appForestPkgId: string;
  pages: { path: string; options: any };
  components: { path: string; options: any };
  props: { path: string; options: any };
  callbacks: { path: string; options: any };
};

export type PageGeneratorOutput = {};
