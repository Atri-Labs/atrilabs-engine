// manages multiple forests in a user session
import { createForest } from "./forest";
import {
  AnyEvent,
  CreateEvent,
  DeleteEvent,
  ForestDef,
  LinkEvent,
  PatchEvent,
  UnlinkEvent,
  Forest,
} from "./types";

type Callback = () => void;

type Unsubscribe = () => void;

type CurrentForest = Forest & {
  on: (event: "reset", cb: Callback) => Unsubscribe;
};

export function createForestManager(defs: ForestDef[]) {
  const forestMap: { [name: string]: { [page: string]: Forest } } = {};

  let _currentForest: Forest;

  async function setCurrentForest(name: string, pageId: string) {
    if (forestMap[name] === undefined) {
      forestMap[name] = {};
    }
    if (forestMap[name]![pageId] === undefined) {
      try {
        const def = defs.find((def) => def.name === name);
        if (def) {
          const forest = await createForest(def);
          forestMap[name]![pageId] = forest;
        } else {
          console.error(`A forest definition with name ${name} not found`);
        }
      } catch (err) {
        console.error(`Failed to load page with id ${pageId}`);
      }
    }
    return forestMap[name]![pageId]!;
  }

  // create current forest
  const onResetListeners: Callback[] = [];
  const createUnsubscriber = (arr: Callback[], cb: Callback) => {
    return () => {
      const index = arr.findIndex((curr) => curr === cb);
      if (index >= 0) {
        arr.splice(index, 1);
      }
    };
  };
  // implement the same api as forest
  const currentForest: CurrentForest = {
    get name() {
      return _currentForest.name;
    },
    tree: (name: string) => {
      return _currentForest.tree(name);
    },
    create: (event: CreateEvent) => {
      return _currentForest.create(event);
    },
    patch: (event: PatchEvent) => {
      return _currentForest.patch(event);
    },
    del: (event: DeleteEvent) => {
      return _currentForest.del(event);
    },
    link: (event: LinkEvent) => {
      return _currentForest.link(event);
    },
    unlink: (event: UnlinkEvent) => {
      return _currentForest.unlink(event);
    },
    handleEvent: (event: AnyEvent) => {
      return _currentForest.handleEvent(event);
    },
    on: (event, cb) => {
      if (event === "reset") {
        onResetListeners.push(cb);
        return createUnsubscriber(onResetListeners, cb);
      }
      throw Error(`CurrentForest doesn't support event of type ${event}`);
    },
  };

  return { setCurrentForest, currentForest };
}
