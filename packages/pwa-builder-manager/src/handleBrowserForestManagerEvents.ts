import { BrowserForestManager } from "@atrilabs/core";

BrowserForestManager.currentForest.subscribeForest((update) => {
  console.log(update);
});
