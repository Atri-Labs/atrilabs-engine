import { menuRegistry, containerRegistry, tabsRegistry } from "./layerDetails";
import { Container, MenuItem, TabItem } from "./types";
import "./layers";

type App = React.ReactChild | Iterable<React.ReactNode>;

const setAppSubscribers: ((app: App) => void)[] = [];
let setAppCalledFlag = false;

// setApp can be called only once!
export function setApp(app: App) {
  if (setAppCalledFlag) return;
  setAppCalledFlag = true;
  setAppSubscribers.forEach((subscriber) => {
    subscriber(app);
  });
}

// This function is only for internal use. Please don't use it outside this package.
export function subscribeSetApp(cb: (app: App) => void) {
  setAppSubscribers.push(cb);
}

/**
 *
 * @param name Pass a local value. The local value must be a string literal as it's replaced with global value during build.
 * @returns
 */
export function menu(name: string) {
  /**
   *
   * @param item menu item
   * @returns
   */
  const register = (item: MenuItem<any>): void => {
    if (menuRegistry[name] === undefined) {
      console.error(
        `Menu with name ${name} does not exist.\nMake sure that the menu is registered by a layer in layer.config.js\nOR\nMake sure to remap the layer in tool.confgi.js.`
      );
      return;
    }
    menuRegistry[name]!.items.push(item);
  };

  return { register };
}

/**
 *
 * @param name Pass a local value. The local value must be a string literal as it's replaced with global value during build.
 * @returns
 */
export function container(name: string) {
  /**
   *
   * @param item container
   * @returns
   */
  const register = (item: Container<any>): void => {
    if (containerRegistry[name] === undefined) {
      console.error(
        `Container with name ${name} does not exist.\nMake sure that the container is registered by a layer in layer.config.js\nOR\nMake sure to remap the layer in tool.confgi.js.`
      );
      return;
    }
    containerRegistry[name]!.items.push(item);
  };

  return { register };
}

/**
 *
 * @param name Pass a local value. The local value must be a string literal as it's replaced with global value during build.
 * @returns
 */
export function tab(name: string) {
  /**
   *
   * @param item tab item
   * @returns
   */
  const register = (item: TabItem<any>): void => {
    if (tabsRegistry[name] === undefined) {
      console.error(
        `Tab bar with name ${name} does not exist.\nMake sure that the tab bar is registered by a layer in layer.config.js\nOR\nMake sure to remap the layer in tool.confgi.js.`
      );
      return;
    }
    tabsRegistry[name]!.items.push(item);
  };

  return { register };
}

// types

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
