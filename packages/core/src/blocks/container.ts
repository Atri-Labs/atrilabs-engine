import { ReactNode } from "react";
import { ContainerItem } from "../types";
import { SubscribeEvent, subscribers } from "./subscribers";

export const containerRegistry: {
  [name: string]: { items: ContainerItem[] };
} = {};

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
