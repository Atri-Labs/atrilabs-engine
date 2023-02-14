import { ReactNode, useEffect } from "react";
import { MenuItem } from "../types";
import { SubscribeEvent, subscribers } from "./subscribers";

const menuRegistry: { [name: string]: { items: MenuItem[] } } = {};

export function setMenuRegistry(registry: {
  [name: string]: { items: MenuItem[] };
}) {
  Object.assign(menuRegistry, registry);
}

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
