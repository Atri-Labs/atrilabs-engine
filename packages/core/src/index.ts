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

type SubscribeEvent = "registered" | "unregistered";

const subscribers: {
  menu: {
    [name: string]: ((payload: {
      item: MenuItem<any>;
      event: SubscribeEvent;
    }) => void)[];
  };
  tabs: {
    [name: string]: ((payload: {
      item: TabItem<any>;
      event: SubscribeEvent;
    }) => void)[];
  };
  containers: {
    [name: string]: ((payload: {
      item: Container<any>;
      event: SubscribeEvent;
    }) => void)[];
  };
} = { menu: {}, tabs: {}, containers: {} };

/**
 *
 * @param name Pass a local value. The local value must be a string literal as it's replaced with global value during build.
 * @returns
 */
export function menu(name: string) {
  if (menuRegistry[name] === undefined) {
    console.error(
      `Menu with name ${name} does not exist.\nMake sure that the menu is registered by a layer in layer.config.js\nOR\nMake sure to remap the layer in tool.confgi.js.`
    );
    return;
  }

  const register = (item: MenuItem<any>): void => {
    menuRegistry[name]!.items.push(item);
    if (subscribers.menu[name]) {
      subscribers.menu[name].forEach((cb) => cb({ item, event: "registered" }));
    }
  };

  const unregister = (item: MenuItem<any>): void => {
    const foundIndex = menuRegistry[name]!.items.findIndex(
      (value) => value === item
    );
    if (foundIndex) {
      menuRegistry[name]!.items.splice(foundIndex, 1);
      if (subscribers.menu[name]) {
        subscribers.menu[name].forEach((cb) =>
          cb({ item, event: "unregistered" })
        );
      }
    }
  };

  const items = () => {
    return menuRegistry[name]!.items;
  };

  const listen = (
    cb: (payload: { item: MenuItem<any>; event: SubscribeEvent }) => void
  ) => {
    if (subscribers.menu[name]) {
      subscribers.menu[name].push(cb);
    } else {
      subscribers.menu[name] = [cb];
    }
    return {
      unsubscribe: () => {
        const foundIndex = subscribers.menu[name].findIndex((value) => {
          return value === cb;
        });
        if (foundIndex >= 0) {
          subscribers.menu[name].splice(foundIndex, 1);
        }
      },
      items: menuRegistry[name].items,
    };
  };

  return { register, listen, items, unregister };
}

/**
 *
 * @param name Pass a local value. The local value must be a string literal as it's replaced with global value during build.
 * @returns
 */
export function container(name: string) {
  if (containerRegistry[name] === undefined) {
    console.error(
      `Container with name ${name} does not exist.\nMake sure that the container is registered by a layer in layer.config.js\nOR\nMake sure to remap the layer in tool.confgi.js.`
    );
    return;
  }

  const register = (item: Container<any>): void => {
    containerRegistry[name]!.items.push(item);
    if (subscribers.containers[name]) {
      subscribers.containers[name].forEach((cb) =>
        cb({ item, event: "registered" })
      );
    }
  };

  const unregister = (item: Container<any>): void => {
    const foundIndex = containerRegistry[name]!.items.findIndex(
      (value) => value === item
    );
    if (foundIndex) {
      containerRegistry[name]!.items.splice(foundIndex, 1);
      if (subscribers.containers[name]) {
        subscribers.containers[name].forEach((cb) =>
          cb({ item, event: "unregistered" })
        );
      }
    }
  };

  const items = () => {
    return containerRegistry[name].items;
  };

  const listen = (
    cb: (payload: { item: Container<any>; event: SubscribeEvent }) => void
  ) => {
    if (subscribers.containers[name]) {
      subscribers.containers[name].push(cb);
    } else {
      subscribers.containers[name] = [cb];
    }
    return {
      unsubscribe: () => {
        const foundIndex = subscribers.containers[name].findIndex((value) => {
          return value === cb;
        });
        if (foundIndex >= 0) {
          subscribers.containers[name].splice(foundIndex, 1);
        }
      },
      items: containerRegistry[name].items,
    };
  };

  return { register, listen, items, unregister };
}

/**
 *
 * @param name Pass a local value. The local value must be a string literal as it's replaced with global value during build.
 * @returns
 */
export function tab(name: string) {
  if (tabsRegistry[name] === undefined) {
    console.error(
      `Tab bar with name ${name} does not exist.\nMake sure that the tab bar is registered by a layer in layer.config.js\nOR\nMake sure to remap the layer in tool.confgi.js.`
    );
    return;
  }

  const register = (item: MenuItem<any>): void => {
    tabsRegistry[name]!.items.push(item);
    if (subscribers.tabs[name]) {
      subscribers.tabs[name].forEach((cb) => cb({ item, event: "registered" }));
    }
  };

  const unregister = (item: Container<any>): void => {
    const foundIndex = tabsRegistry[name]!.items.findIndex(
      (value) => value === item
    );
    if (foundIndex) {
      tabsRegistry[name]!.items.splice(foundIndex, 1);
      if (subscribers.tabs[name]) {
        subscribers.tabs[name].forEach((cb) =>
          cb({ item, event: "unregistered" })
        );
      }
    }
  };

  const items = () => {
    return tabsRegistry[name].items;
  };

  const listen = (
    cb: (payload: { item: TabItem<any>; event: SubscribeEvent }) => void
  ) => {
    if (subscribers.tabs[name]) {
      subscribers.tabs[name].push(cb);
    } else {
      subscribers.tabs[name] = [cb];
    }
    return {
      unsubscribe: () => {
        const foundIndex = subscribers.tabs[name].findIndex((value) => {
          return value === cb;
        });
        if (foundIndex >= 0) {
          subscribers.tabs[name].splice(foundIndex, 1);
        }
      },
      items: tabsRegistry[name].items,
    };
  };

  return { register, listen, items, unregister };
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
