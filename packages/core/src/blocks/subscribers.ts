import { ReactNode } from "react";
import { TabItem } from "../types";

export type SubscribeEvent = "registered" | "unregistered";

export const subscribers: {
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
