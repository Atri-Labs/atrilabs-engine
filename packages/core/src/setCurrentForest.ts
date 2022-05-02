import { ForestDef, createForestManager } from "@atrilabs/forest";

// This array is filled by a babel-loader
const defs: ForestDef[] = [];

export const { setCurrentForest, currentForest } = createForestManager(defs);
