import { BrowserForestManager, api } from "@atrilabs/core";
import { useEffect, useCallback, useRef } from "react";

export default function () {
  const forestsLoaded = useRef<{ [forestId: string]: { forestPkgId: string } }>(
    {}
  );

  const loadDataCb = useCallback(() => {
    const currentForest = BrowserForestManager.currentForest;
    const forestPkgId = currentForest.forestPkgId;
    const forestId = currentForest.forestId;
    // fetch and subscribe only if not already loaded
    if (!forestsLoaded.current[forestId]) {
      api.fetchEvents(forestPkgId, forestId).then((events) => {
        events.forEach((event) => {
          currentForest.handleEvents({
            events: [event],
            meta: { agent: "server-sent" },
            name: "",
          });
        });
      });
      forestsLoaded.current[forestId] = { forestPkgId };
    }
  }, []);

  useEffect(() => {
    // try to load events on start
    // it might fail, because currentForest might not be set yet
    try {
      loadDataCb();
    } catch (err) {}
  }, [loadDataCb]);

  useEffect(() => {
    // reload data on forest reset
    const currentForest = BrowserForestManager.currentForest;
    const unsub = currentForest.on("reset", () => {
      loadDataCb();
    });
    return unsub;
  }, [loadDataCb]);

  useEffect(() => {
    api.subscribeExternalEvents((forestPkgId, forestId, event) => {
      // call handle events only if the forest is already loaded
      if (
        forestsLoaded.current[forestId] &&
        forestPkgId === forestsLoaded.current[forestId].forestPkgId
      ) {
        BrowserForestManager.getForest(forestPkgId, forestId)?.handleEvents({
          events: [event],
          meta: { agent: "server-sent" },
          name: "",
        });
      }
    });
  }, []);
  return <></>;
}
