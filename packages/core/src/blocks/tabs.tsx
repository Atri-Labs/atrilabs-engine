import { useEffect } from "react";
import { TabItem } from "../types";
import { SubscribeEvent, subscribers } from "./subscribers";

const tabsRegistry: { [name: string]: { items: TabItem[] } } = {};

export function setTabRegistry(registry: {
  [name: string]: { items: TabItem[] };
}) {
  Object.assign(tabsRegistry, registry);
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
