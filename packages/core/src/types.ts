import React from "react";

export type MenuItem<PropTypes> = {
  comp: React.FC<PropTypes>;
  props: PropTypes;
};

export type Container<PropTypes> = {
  comp: React.FC<PropTypes>;
  props: PropTypes;
};

export type TabItem<PropTypes> = {
  comp: React.FC<PropTypes>;
  props: PropTypes;
};

/**
 * map of a name local to a layer with it's global name
 */
export type NameMap = { [localName: string]: string };

export type LayerConfig = {
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
    eventServer: { path: string; options: any };
    codeGenerators: { path: string; options: any }[];
  };
};
