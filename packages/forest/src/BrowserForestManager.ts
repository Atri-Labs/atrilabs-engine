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
  ForestUpdateSubscriber,
  EventMetaData,
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
  /**
   *
   * If the currentForest changes, all the listeners will automatically start
   * listening updates from the newly set current forest.
   *
   * To actually achieve this, this module implements it's own observer pattern.
   * On any event from currently set forest, the variable _currentForestSubscribers is looped through.
   * On setting current forest, the variable _forestUnsubscriber is updated.
   */
  let _currentForestSubscribers: ForestUpdateSubscriber[] = [];
  let _forestUnsubscriber: Unsubscribe;

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
    if (_forestUnsubscriber) _forestUnsubscriber();
    // call all current forest subscribers & update forest unsubscriber
    _forestUnsubscriber = _currentForest.subscribeForest((update, options) => {
      _currentForestSubscribers.forEach((cb) => cb(update, options));
    });
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
    create: (event: CreateEvent, meta: EventMetaData) => {
      return _currentForest.create(event, meta);
    },
    patch: (event: PatchEvent, meta: EventMetaData) => {
      return _currentForest.patch(event, meta);
    },
    del: (event: DeleteEvent, meta: EventMetaData) => {
      return _currentForest.del(event, meta);
    },
    link: (event: LinkEvent, meta: EventMetaData) => {
      return _currentForest.link(event, meta);
    },
    unlink: (event: UnlinkEvent, meta: EventMetaData) => {
      return _currentForest.unlink(event, meta);
    },
    handleEvents: (data: {
      name: string;
      events: AnyEvent[];
      meta: { agent: "browser" | "server-sent" };
    }) => {
      return _currentForest.handleEvents(data);
    },
    on: (event, cb) => {
      if (event === "reset") {
        onResetListeners.push(cb);
        return createUnsubscriber(onResetListeners, cb);
      }
      throw Error(`CurrentForest doesn't support event of type ${event}`);
    },
    subscribeForest: (cb) => {
      _currentForestSubscribers.push(cb);
      return () => {
        const index = _currentForestSubscribers.findIndex(
          (curr) => curr === cb
        );
        if (index >= 0) {
          _currentForestSubscribers.splice(index, 1);
        }
      };
    },
  };

  return { getForest, setCurrentForest, currentForest };
}
