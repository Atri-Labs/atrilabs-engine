import {
  ImportedResource,
  ToolConfig,
  ServerInfo,
  BuildInfo,
  AppInfo as AppInfoFile,
} from "@atrilabs/core";
import { Forest, ForestDef } from "@atrilabs/forest";

export type Infos = { app: AppInfoFile; server: ServerInfo; build: BuildInfo };

export type AppGeneratorOptions = {
  // forest package that defines the schema for different trees
  // that are part of the app
  appForestPkgId: string;
  // absolute path to the output app
  outputDir: string;
  // controllers for different languages
  controllers: {
    python: {
      // python controller directory
      dir: string;
      // generate stub at component level
      stubGenerators: { modulePath: string; options: any }[];
    };
  };
  // root component alias (body / root)
  rootComponentId: string;
  // generates component for a page/forest. options will be passed as custom.
  components: { modulePath: string; options: any }[];
  // generates props for a page/forest. options will be passed as custom.
  props: { modulePath: string; options: any }[];
  // generates callbacks for a page/forest. options will be passes as custom.
  callbacks: { modulePath: string; options: any }[];
  // adds resources to index.html
  resources: { modulePath: string; options: any }[];
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
  // info files
  infos: Infos;
  // custom options that are module specific
  custom: any;
};

export type ComponentGeneratorOutput = {
  [compId: string]: {
    alias: string;
    modulePath: string;
    exportedVarName: string;
    parent: { id: string; index: number };
  };
};

// returns all the components from a page
export type ComponentGeneratorFunction = (
  options: ComponentGeneratorOptions
) => ComponentGeneratorOutput;

export type PropsGeneratorOptions = {
  forestDef: ForestDef;
  forest: Forest;
  // info files
  infos: Infos;
  custom: any;
};

export type PropsGeneratorOutput = {
  [compId: string]: {
    props: any;
    ioProps?: {
      [propName: string]: {
        mode: "upload" | "download" | "duplex";
        type: "files" | "stream";
      };
    };
    breakpointProps?: { [maxWidth: string]: any };
    cssProps?: {
      [propName: string]: {
        props: React.CSSProperties;
        breakpoints: { [maxWidth: string]: React.CSSProperties };
      };
    };
  };
};

// returns all the props from a page
export type PropsGeneratorFunction = (
  options: PropsGeneratorOptions
) => PropsGeneratorOutput;

export type ManifestGetter = (meta: { pkg: string; key: string }) => any;

export type PythonStubGeneratorOptions = {
  forestDef: ForestDef;
  forest: Forest;
  getManifest: ManifestGetter;
  // info files
  infos: Infos;
  custom: any;
};

export type PythonStubGeneratorOutput = {
  vars: {
    // alias can be varName
    [varName: string]: {
      // joi schema for type setting
      type: any;
      // initial value
      value: any;
      // key can be class name
      key: string;
      // ioProps
      ioProps?: {
        [propName: string]: {
          [propName: string]: {
            mode: "upload" | "download" | "duplex";
            type: "files" | "stream";
          };
        };
      };
      // whether the variable should be returned in getState call
      gettable: boolean;
      // whether the variable should be included in updateState call
      updateable: boolean;
      // callbacks
      callbacks: CallbackGeneratorOutput["0"]["callbacks"];
    };
  };
};

export type PythonStubGeneratorFunction = (
  options: PythonStubGeneratorOptions
) => PythonStubGeneratorOutput;

export type AppBuildOptions = {
  outputDir: string;
  rootComponentId: string;
  appInfo: AppInfo;
  controllerProps: { [pageId: string]: { [alias: string]: any } | undefined };
};

export type CallbackGeneratorOptions = {
  forestDef: ForestDef;
  forest: Forest;
  // info files
  infos: Infos;
  custom: any;
};

export type CallbackGeneratorOutput = {
  [compId: string]: {
    callbacks: {
      [callbackName: string]: {
        handlers: (
          | { sendEventData: boolean }
          | {
              sendFile: ({ self: boolean } | { compId: string }) & {
                props: string[];
              };
            }
        )[];
        actions: (
          | { type: "do_nothing" }
          | { type: "file_input"; selector: string[] }
          | { type: "controlled"; selector: string[] }
        )[];
      };
    };
  };
};

// returns all the props from a page
export type CallbackGeneratorFunction = (
  options: CallbackGeneratorOptions
) => CallbackGeneratorOutput;

export type AppInfo = {
  pages: {
    [pageId: string]: {
      name: string;
      route: string;
      componentGeneratorOutput: ComponentGeneratorOutput;
      propsGeneratorOutput: PropsGeneratorOutput;
    };
  };
};

export type PageState = {
  [alias: string]: any;
};

export type ResourceGeneratorOptions = {
  resourcesConfig: ToolConfig["resources"];
  custom: any;
};

export type ResourceGeneraterOutput = ImportedResource[];

export type ResourceGeneratorFunction = (
  options: ResourceGeneratorOptions
) => ResourceGeneraterOutput;
