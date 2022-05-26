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
  forestPkgId: string;
  forestId: string;
  on: (event: "reset", cb: Callback) => Unsubscribe;
};

export function createBrowserForestManager(defs: ForestDef[]) {
  const forestMap: { [forestPkgId: string]: { [forestId: string]: Forest } } =
    {};

  let _currentForest: Forest & { forestPkgId: string; forestId: string };

  function getForest(forestPkgId: string, forestId: string) {
    if (forestMap[forestPkgId] === undefined) {
      forestMap[forestPkgId] = {};
    }
    if (forestMap[forestPkgId]![forestId] === undefined) {
      try {
        const def = defs.find((def) => def.pkg === forestPkgId);
        if (def) {
          const forest = createForest(def);
          forestMap[forestPkgId]![forestId] = forest;
        } else {
          console.error(`Forest package with id ${forestPkgId} not found`);
          return;
        }
      } catch (err) {
        console.error(`Failed to load forest with id ${forestId}`);
        return;
      }
    }
    return forestMap[forestPkgId]![forestId];
  }

  function setCurrentForest(forestPkgId: string, forestId: string) {
    const forest = getForest(forestPkgId, forestId);
    if (forest) {
      _currentForest = {
        ...forest,
        forestPkgId,
        forestId,
      };
    }
    onResetListeners.forEach((cb) => {
      cb();
    });
    return forest;
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
    get forestPkgId() {
      return _currentForest.forestPkgId;
    },
    get forestId() {
      return _currentForest.forestId;
    },
    tree: (treeId: string) => {
      return _currentForest.tree(treeId);
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

  return { getForest, setCurrentForest, currentForest };
}
