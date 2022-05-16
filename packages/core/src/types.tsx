import { ReactNode } from "react";

/**
 * NOTE: A layer entry function must return Container, Menu, Tab
 * or a React.Fragment with Container, Menu, Tab.
 *
 * A runtime entry function must take layers as children.
 * The runtime entry function must manage the layers as deemed fit.
 */

export type MenuItem = ReactNode | ReactNode[];

export type ContainerItem = ReactNode | ReactNode[];

export type TabItem = ReactNode | ReactNode[];

/**
 * map of a name local to a layer with it's global name
 */
export type NameMap = { [localName: string]: string };

export type LayerConfig = {
  modulePath: string;
  requires: Partial<{ menu: NameMap; containers: NameMap; tabs: NameMap }>;
  exposes: Partial<{ menu: NameMap; containers: NameMap; tabs: NameMap }>;
  runtime?: { pkg: string };
};

export type RuntimeConfig = {
  modulePath: string;
  requires: Partial<{ menu: NameMap; containers: NameMap; tabs: NameMap }>;
  exposes: Partial<{ menu: NameMap; containers: NameMap; tabs: NameMap }>;
};

export type ForestsConfig = {
  [forestName: string]: { pkg: string; modulePath: string; name: string }[];
};

export type ToolConfig = {
  forests: ForestsConfig;
  forestManager: {
    // path to module implementing forest manager for backend
    path: string;
    // options will be passed on to the forest manager ctr fn as argument
    options: any;
  };
  layers: {
    pkg: string;
    remap?: Partial<{
      requires: LayerConfig["requires"];
      exposes: LayerConfig["exposes"];
    }>;
  }[];
  /**
   * directory where editor code will be emitted.
   * web    - contains ui of editor
   * server - contains backend of editor
   */
  output: string;
  /**
   * All the services must export a default function
   * The args for the function will be -
   * 1. ToolConfig - default export from tool.config.json file
   * 2. options - custom options
   */
  services: {
    fileServer: { path: string; options: any };
    eventServer: { path: string; options: any };
    codeGenerators: { path: string; options: any }[];
  };
  env: {
    [key: string]: number | string | boolean;
  };
  runtimes: {
    pkg: string;
    remap?: Partial<{
      requires: RuntimeConfig["requires"];
      exposes: RuntimeConfig["exposes"];
    }>;
  }[];
};
