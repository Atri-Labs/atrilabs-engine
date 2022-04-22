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

export type ToolConfig = {
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
};
