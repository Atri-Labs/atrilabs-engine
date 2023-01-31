import { ForestDef, createBrowserForestManager } from "@atrilabs/forest";

// This array is filled by a loader
declare var defs: ForestDef[];

export const BrowserForestManager = createBrowserForestManager(defs);
