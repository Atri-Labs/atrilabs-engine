import { manifestRegistryController } from "@atrilabs/manifest-registry";
import { CanvasComponentStore, ComponentReverseMap } from "../types";
import React from "react";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import { canvasMachineInterpreter } from "./init";

const componentStore: CanvasComponentStore = {};
const componentReverseMap: ComponentReverseMap = {};

function searchComponentFromManifestRegistry(manifestData: {
  manifestSchema: string;
  pkg: string;
  key: string;
}) {
  const { manifestSchema, pkg, key } = manifestData;
  const registry = manifestRegistryController.readManifestRegistry();
  const fullManifest = registry[manifestSchema].manifests.find((curr) => {
    return curr.pkg === pkg && curr.manifest.meta.key === key;
  });
  return fullManifest;
}

function processManifest(manifest: ReactComponentManifestSchema) {
  const acceptsChild = typeof manifest.dev.acceptsChild === "function";
  const callbacks: { [callbackName: string]: any } = {};
  Object.keys(manifest.dev.attachCallbacks).forEach((callbackName) => {
    callbacks[callbackName] = () => {};
  });
  const decorators: React.FC<any>[] = [];
  if (acceptsChild) {
  }
  return { acceptsChild, callbacks, decorators };
}

function createComponent(
  manifestData: { manifestSchema: string; pkg: string; key: string },
  componentData: {
    canvasZoneId: string;
    id: string;
    props: any;
    parent: { id: string; index: number };
  }
) {
  const fullManifest = searchComponentFromManifestRegistry(manifestData);
  if (fullManifest) {
    const { id, canvasZoneId, props, parent } = componentData;
    const { devComponent, component } = fullManifest;
    const { decorators, acceptsChild, callbacks } = processManifest(
      fullManifest.manifest
    );
    // update component store
    componentStore[canvasZoneId] = {
      ...componentStore[canvasZoneId],
      [id]: {
        id,
        ref: React.createRef(),
        comp: devComponent ?? component!,
        props,
        parent,
        decorators,
        acceptsChild,
        callbacks,
      },
    };
    // update reverse map
    componentReverseMap[id] = {
      canvasZoneId,
      parentCompId: parent.id,
    };
    // inform the canvas machine
    canvasMachineInterpreter.send({
      type: "COMPONENT_CREATED",
      compId: id,
      canvasZoneId,
      parentId: parent.id,
    });
  } else {
    throw Error(
      `Could not find the manifest for pkg=${manifestData.pkg} key=${manifestData.key} in manifestSchmea=${manifestData.manifestSchema}`
    );
  }
}

export const componentStoreApi = {
  createComponent,
};
