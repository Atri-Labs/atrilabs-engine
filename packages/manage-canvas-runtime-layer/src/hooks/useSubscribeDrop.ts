import { useEffect } from "react";
import { subscribeDrop, createComponent } from "@atrilabs/canvas-runtime";
import ReactComponentManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";
import { manifestRegistryController } from "@atrilabs/core";

export const useSubscribeDrop = () => {
  useEffect(() => {
    const unsub = subscribeDrop((args, loc, caughtBy) => {
      console.log("listened subscribe drop", args);
      if (args.dragData.type === "component") {
        const dragData = args.dragData;
        if (dragData.data.manifestSchema === ReactComponentManifestSchemaId) {
          // find manifest from manifest registry
          const manifestRegistry =
            manifestRegistryController.readManifestRegistry();
          const manifest = manifestRegistry[
            ReactComponentManifestSchemaId
          ].components.find((curr) => {
            return (
              curr.pkg === dragData.data.pkg &&
              curr.component.meta.key === dragData.data.key
            );
          });
          console.log(manifest);
          // use CanvasAPI to create component
          if (manifest) {
            const component = manifest.component;
            createComponent(
              component.comp,
              component.props,
              // TODO: get index from manifest schema
              { id: caughtBy, index: 0 },
              // TODO: get decorators from manifest schema
              [],
              // TODO: create catchers from manifest schema
              []
            );
          }
        }
      }
    });
    return unsub;
  }, []);
};
