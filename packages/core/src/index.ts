import { JsxElement } from "typescript";
import { menuRegistry, containerRegistry, tabsRegistry } from "./layerDetails";
import { Container, MenuItem, TabItem } from "./types";

export function setApp(_app: JsxElement) {}

export const menu = {
  /**
   *
   * @param name global name of the menu
   * @param item menu item
   * @returns
   */
  register: (name: string, item: MenuItem<any>): void => {
    if (menuRegistry[name] === undefined) {
      console.error(
        `Menu with name ${name} does not exist.\nMake sure that the menu is registered by a layer in layer.config.js\nOR\nMake sure to remap the layer in tool.confgi.js.`
      );
      return;
    }
    menuRegistry[name]!.items.push(item);
  },
};

export const container = {
  /**
   *
   * @param name global name of the menu
   * @param item container
   * @returns
   */
  register: (name: string, item: Container<any>): void => {
    if (containerRegistry[name] === undefined) {
      console.error(
        `Container with name ${name} does not exist.\nMake sure that the container is registered by a layer in layer.config.js\nOR\nMake sure to remap the layer in tool.confgi.js.`
      );
      return;
    }
    containerRegistry[name]!.items.push(item);
  },
};

export const tabs = {
  /**
   *
   * @param name global name of the menu
   * @param item tab item
   * @returns
   */
  register: (name: string, item: TabItem<any>): void => {
    if (tabsRegistry[name] === undefined) {
      console.error(
        `Tab bar with name ${name} does not exist.\nMake sure that the tab bar is registered by a layer in layer.config.js\nOR\nMake sure to remap the layer in tool.confgi.js.`
      );
      return;
    }
    tabsRegistry[name]!.items.push(item);
  },
};

// types
export type ToolConfig = {
  layers: { pkg: string }[];
  /**
   * directory where editor code will be emitted.
   * web    - contains ui of editor
   * server - contains backend of editor
   */
  output: string;
};

/**
 * map of a name local to a layer with it's global name
 */
export type NameMap = { [localName: string]: string };

export type LayerConfig = {
  modulePath: string;
  exports: Partial<{ menu: NameMap; containers: NameMap; tabs: NameMap }>;
};
