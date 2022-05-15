import { MenuItem, ContainerItem, TabItem } from "./types";

/**
 * The layer details such as menuRegistry etc. is expected
 * to be filled by a babel-loader during build.
 */

export const menuRegistry: {
  [name: string]: { items: MenuItem[] };
} = {};

export const containerRegistry: {
  [name: string]: { items: ContainerItem[] };
} = {};

export const tabsRegistry: { [name: string]: { items: TabItem[] } } = {};
