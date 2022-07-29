import React, { PropsWithChildren, ReactNode, useEffect } from "react";
import { menuRegistry, containerRegistry, tabsRegistry } from "./layerDetails";
import { ContainerItem, MenuItem, TabItem } from "./types";

type SubscribeEvent = "registered" | "unregistered";

const subscribers: {
  menu: {
    [name: string]: ((payload: {
      nodes: ReactNode | ReactNode[];
      event: SubscribeEvent;
    }) => void)[];
  };
  tabs: {
    [name: string]: ((payload: {
      item: TabItem;
      event: SubscribeEvent;
    }) => void)[];
  };
  containers: {
    [name: string]: ((payload: {
      node: ReactNode | ReactNode[];
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

  const register = (item: MenuItem): void => {
    menuRegistry[name]!.items.push(item);
    menuRegistry[name]!.items.sort((a, b) => {
      return a.order - b.order;
    });
    if (subscribers.menu[name]) {
      subscribers.menu[name].forEach((cb) =>
        cb({ nodes: item.nodes, event: "registered" })
      );
    }
  };

  const unregister = (nodes: MenuItem["nodes"]): void => {
    const foundIndex = menuRegistry[name]!.items.findIndex(
      (value) => value.nodes === nodes
    );
    if (foundIndex >= 0) {
      menuRegistry[name]!.items.splice(foundIndex, 1);
      if (subscribers.menu[name]) {
        subscribers.menu[name].forEach((cb) =>
          cb({ nodes, event: "unregistered" })
        );
      }
    }
  };

  const items = () => {
    return menuRegistry[name]!.items;
  };

  const listen = (
    cb: (payload: { nodes: MenuItem["nodes"]; event: SubscribeEvent }) => void
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

  const register = (item: ContainerItem): void => {
    // close previous container item
    containerRegistry[name]!.items.forEach((item) => item.onClose());
    // Containers won't remember the history of items they have rendered till now.
    // Hence, replacing all the contents of items with just one new item.
    containerRegistry[name]!.items = [item];
    if (subscribers.containers[name]) {
      subscribers.containers[name].forEach((cb) =>
        cb({ node: item.node, event: "registered" })
      );
    }
  };

  const unregister = (node: ContainerItem["node"]): void => {
    const foundIndex = containerRegistry[name]!.items.findIndex(
      (value) => value.node === node
    );
    if (foundIndex >= 0) {
      containerRegistry[name]!.items.splice(foundIndex, 1);
      if (subscribers.containers[name]) {
        subscribers.containers[name].forEach((cb) =>
          cb({ node, event: "unregistered" })
        );
      }
    }
  };

  const pop = () => {
    const item = containerRegistry[name]!.items.pop();
    if (subscribers.containers[name] && item) {
      subscribers.containers[name].forEach((cb) =>
        cb({ node: item.node, event: "unregistered" })
      );
    }
  };

  const items = () => {
    return containerRegistry[name].items;
  };

  const listen = (
    cb: (payload: {
      node: ReactNode | ReactNode[];
      event: SubscribeEvent;
    }) => void
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

  return { register, listen, items, unregister, pop };
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

  const register = (item: TabItem): void => {
    tabsRegistry[name]!.items.push(item);
    if (subscribers.tabs[name]) {
      subscribers.tabs[name].forEach((cb) => cb({ item, event: "registered" }));
    }
  };

  const unregister = (item: TabItem): void => {
    const foundIndex = tabsRegistry[name]!.items.findIndex(
      (value) => value === item
    );
    if (foundIndex >= 0) {
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
    cb: (payload: { item: TabItem; event: SubscribeEvent }) => void
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

export type ContainerProps = {
  children: ReactNode;
  name: string;
  onClose: () => void;
};

export const Container: React.FC<ContainerProps> = (props) => {
  useEffect(() => {
    const namedContainer = container(props.name);
    if (Array.isArray(props.children)) {
      props.children.forEach((child) => {
        namedContainer?.register({ node: child, onClose: props.onClose });
      });
    } else {
      namedContainer?.register({
        node: props.children,
        onClose: props.onClose,
      });
    }
    return () => {
      if (Array.isArray(props.children)) {
        props.children.forEach((child) => {
          namedContainer?.unregister(child);
        });
      } else {
        namedContainer?.unregister(props.children);
      }
    };
  }, [props]);
  return <></>;
};

export type MenuProps = {
  children: ReactNode | ReactNode[];
  name: string;
  order: number;
};

export const Menu: React.FC<MenuProps> = (props) => {
  useEffect(() => {
    const namedMenu = menu(props.name);
    if (Array.isArray(props.children)) {
      props.children.forEach((child) => {
        namedMenu?.register({ nodes: child, order: props.order });
      });
    } else {
      namedMenu?.register({ nodes: props.children, order: props.order });
    }
    return () => {
      if (Array.isArray(props.children)) {
        props.children.forEach((child) => {
          namedMenu?.unregister(child);
        });
      } else {
        namedMenu?.unregister(props.children);
      }
    };
  }, [props]);
  return <></>;
};

export type TabProps = {
  name: string;
} & TabItem;

export const Tab: React.FC<TabProps> = (props) => {
  useEffect(() => {
    const namedTab = tab(props.name);
    namedTab?.register(props);
    return () => {
      namedTab?.unregister(props);
    };
  }, [props]);
  return <></>;
};

const refRegistry: {
  [name: string]: React.RefObject<any>;
} = {};

export function attachRef(name: string, ref: React.RefObject<any>) {
  refRegistry[name] = ref;
}

/**
 *
 * detachRef deletes a ref from registry only if the provided ref matches the existing ref.
 * If it doesn't matches, then it does nothing.
 */
export function detachRef(name: string, ref: React.RefObject<any>) {
  if (refRegistry[name] && refRegistry[name] === ref) {
    delete refRegistry[name];
  }
}

export function getRef(name: string) {
  return refRegistry[name];
}
