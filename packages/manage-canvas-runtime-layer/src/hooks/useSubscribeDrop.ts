import { useEffect } from "react";
import { subscribeDrop } from "@atrilabs/canvas-runtime";
import ReactComponentManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";

export const useSubscribeDrop = () => {
  useEffect(() => {
    const unsub = subscribeDrop((args) => {
      console.log("listened subscribe drop", args);
      if (args.dragData.type === "component") {
        if (
          args.dragData.data.manifestSchema === ReactComponentManifestSchemaId
        ) {
        }
      }
    });
    return unsub;
  }, []);
};
