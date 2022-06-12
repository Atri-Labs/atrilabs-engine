import { Forest, ForestDef } from "@atrilabs/forest";

export type AppGeneratorOptions = {
  // forest package that defines the schema for different trees
  // that are part of the app
  appForestPkgId: string;
  // absolute path to the output app
  outputDir: string;
  // controllers for different languages
  controllers: {
    // python controller directory
    python: { dir: string };
  };
  // generates component for a page/forest
  components: { modulePath: string }[];
  // generates props for a page/forest
  props: { modulePath: string }[];
};

export type ComponentGetter = (meta: { pkg: string; key: string }) =>
  | {
      exportedVarName: any;
      modulePath: string;
    }
  | undefined;

export type ComponentGeneratorOptions = {
  forestDef: ForestDef;
  forest: Forest;
  getComponentFromManifest: ComponentGetter;
};

export type ComponentGeneratorOutput = {
  [compId: string]: {
    alias: string;
    modulePath: string;
    exportedVarName: string;
  };
};

// returns all the components from a page
export type ComponentGeneratorFunction = (
  options: ComponentGeneratorOptions
) => ComponentGeneratorOutput;

export type PropsGeneratorOptions = {
  forestDef: ForestDef;
  forest: Forest;
};

export type PropsGeneratorOutput = { [compId: string]: { props: any } };

// returns all the props from a page
export type PropsGeneratorFunction = (
  options: PropsGeneratorOptions
) => PropsGeneratorOutput;
