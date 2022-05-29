import { api, BrowserForestManager } from "@atrilabs/core";
import { useEffect } from "react";

export const useSubscribeEvents = () => {
  useEffect(() => {
    const currForestPkgId = BrowserForestManager.currentForest.forestPkgId;
    const currForestId = BrowserForestManager.currentForest.forestId;
    const unsub = api.subscribeEvents((forestPkgId, forestId, event) => {
      if (currForestPkgId === forestPkgId && currForestId === forestId) {
        // handle wire, rewire, dewire, link, unlink
      }
    });
    return unsub;
  }, []);
};
