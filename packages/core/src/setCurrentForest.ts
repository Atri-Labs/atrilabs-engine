import { ForestDef, createForestManager } from "@atrilabs/forest";

const defs: ForestDef[] = [];

export const { setCurrentForest, currentForest } = createForestManager(defs);
