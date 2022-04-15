import { MenuItem, Container, TabItem } from "./types";

/**
 * The layer details such as menuRegistry etc. is expected
 * to be filled by a babel-loader during build.
 */

export const menuRegistry: {
  [name: string]: { items: MenuItem<any>[] };
} = {};

export const containerRegistry: {
  [name: string]: { items: Container<any>[] };
} = {};

export const tabsRegistry: { [name: string]: { items: TabItem<any>[] } } = {};
