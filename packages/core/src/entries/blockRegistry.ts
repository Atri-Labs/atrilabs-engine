import { ContainerItem, MenuItem, TabItem } from "../types";
import {
  setContainerRegistry,
  setMenuRegistry,
  setTabRegistry,
} from "../blocks";

type BlockRegistry = {
  containers: { [name: string]: { items: ContainerItem[] } };
  menu: { [name: string]: { items: MenuItem[] } };
  tabs: { [name: string]: { items: TabItem[] } };
};

export declare var registry: BlockRegistry;

setContainerRegistry(registry.containers);
setTabRegistry(registry.tabs);
setMenuRegistry(registry.menu);
