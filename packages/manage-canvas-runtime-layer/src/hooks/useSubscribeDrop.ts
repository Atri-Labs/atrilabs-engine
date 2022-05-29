import { useEffect } from "react";
import { subscribeDrop } from "@atrilabs/canvas-runtime";
import ReactComponentManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";
import { getId } from "@atrilabs/core";
import { api, BrowserForestManager } from "@atrilabs/core";
import { CreateEvent } from "@atrilabs/forest";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";

export const useSubscribeDrop = () => {
  useEffect(() => {
    const unsub = subscribeDrop((args, loc, caughtBy) => {
      console.log("listened subscribe drop", args);
      if (args.dragData.type === "component") {
        const forestPkgId = BrowserForestManager.currentForest.forestPkgId;
        const forestId = BrowserForestManager.currentForest.forestId;
        const pkg = args.dragData.data.pkg;
        const key = args.dragData.data.key;
        const event: CreateEvent = {
          id: getId(),
          type: `CREATE$$${ComponentTreeId}`,
          meta: {
            pkg: pkg,
            key: key,
            manifestSchemaId: ReactComponentManifestSchemaId,
          },
          state: { parent: { id: caughtBy, index: 0 } },
        };
        api.postNewEvent(forestPkgId, forestId, event);
      }
    });
    return unsub;
  }, []);
};
