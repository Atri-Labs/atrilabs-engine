import { AnyEvent, ForestDef } from "./types";

async function importAllTrees(treeDefs: ForestDef["trees"]) {
  const importedModules = treeDefs.map((def) => {
    return import(require.resolve(`${def.pkg}/${def.modulePath}`)).then(
      (mod) => mod.default
    );
  });
  return await Promise.all(importedModules);
}

export default async function createForest(def: ForestDef) {
  const treeDefs = def.trees;

  // import all trees from definition
  const defaultFns = await importAllTrees(treeDefs);

  // create a map for easily accessing a tree when an event arrives
  const defaultFnMap: { [id: string]: () => void } = {};
  treeDefs.forEach((def, index) => {
    defaultFnMap[`${def.modulePath}$$${def.pkg}`] = defaultFns[index];
  });

  function tree(name: string) {}

  // store event
  function store(event: AnyEvent) {}

  return { tree, store };
}
