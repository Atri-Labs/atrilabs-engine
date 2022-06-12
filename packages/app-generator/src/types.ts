export type AppGeneratorOptions = {
  // forest package that defines the schema for different trees
  // that are part of the app
  appForestPkgId: string;
  // absolute path to the output app
  outputDir: string;
  controllers: {
    // python controller directory
    python: { path: string };
  };
  pages: { path: string; options: any };
  components: { path: string; options: any };
  props: { path: string; options: any };
  callbacks: { path: string; options: any };
};

export type PageGeneratorOutput = {};
