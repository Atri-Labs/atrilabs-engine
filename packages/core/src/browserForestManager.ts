import { ForestDef, createBrowserForestManager } from "@atrilabs/forest";

// This array is filled by a babel-loader
const defs: ForestDef[] = [];

export const BrowserForestManager = createBrowserForestManager(defs);
