// manages multiple forests in a user session
import createForest from "./forest";
import { AnyEvent, ForestDef } from "./types";

type FromPromise<T extends Promise<any>> = T extends Promise<infer U>
  ? U
  : never;

type Forest = FromPromise<ReturnType<typeof createForest>>;

export default function createForestManager(defs: ForestDef[]) {
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
        }
      } catch (err) {
        console.error(`Failed to load page with id ${pageId}`);
      }
    }
    return forestMap[name]![pageId]!;
  }

  // implement the same api as forest
  const currentForest: Forest = {
    tree: (name: string) => {
      return _currentForest.tree(name);
    },
    store: (event: AnyEvent) => {
      return _currentForest.store(event);
    },
  };

  return { setCurrentForest, currentForest };
}
