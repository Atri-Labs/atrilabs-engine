// manages multiple forests in a user session
import createForest from "./forest";
import { ForestDef } from "./types";

type Forest = ReturnType<typeof createForest>;

export default function createForestManager(defs: ForestDef[]) {
  const forests: Forest[] = [];

  const forestMap: { [name: string]: { [page: string]: Forest } } = {};

  async function setCurrentForest(name: string, pageId: string) {
    if (forestMap[name] === undefined) {
      forestMap[name] = {};
    }
    if (forestMap[name]![pageId] === undefined) {
      try {
        const def = defs.find((def) => def.name === name);
        if (def) {
          const forest = createForest(def);
        }
      } catch (err) {
        console.error(`Failed to load page with id ${pageId}`);
      }
    }
  }

  return { setCurrentForest };
}
