import { manifestRegistryController } from "@atrilabs/manifest-registry";
import {
  CanvasComponent,
  CanvasComponentStore,
  CanvasZoneReverseMap,
  ComponentReverseMap,
} from "../types";
import React from "react";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import { canvasMachineInterpreter } from "./init";
import { CANVAS_ZONE_ROOT_ID } from "./consts";

const componentStore: CanvasComponentStore = {};
const componentReverseMap: ComponentReverseMap = {};
const canvasZoneReverseMap: CanvasZoneReverseMap = {};

function searchComponentFromManifestRegistry(manifestData: {
  manifestSchemaId: string;
  pkg: string;
  key: string;
}) {
  const { manifestSchemaId, pkg, key } = manifestData;
  const registry = manifestRegistryController.readManifestRegistry();
  const fullManifest = registry[manifestSchemaId].manifests.find((curr) => {
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
  manifestData: { manifestSchemaId: string; pkg: string; key: string },
  componentData: {
    id: string;
    props: any;
    parent: { id: string; index: number; canvasZoneId: string };
  }
) {
  const fullManifest = searchComponentFromManifestRegistry(manifestData);
  if (fullManifest) {
    const { id, props, parent } = componentData;
    const { devComponent, component } = fullManifest;
    const { decorators, acceptsChild, callbacks } = processManifest(
      fullManifest.manifest
    );
    // update component store
    componentStore[id] = {
      id,
      ref: React.createRef(),
      comp: devComponent ?? component!,
      props,
      parent,
      decorators,
      acceptsChild,
      callbacks,
      meta: manifestData,
    };
    // update reverse map
    if (parent.id !== CANVAS_ZONE_ROOT_ID) {
      componentReverseMap[parent.id] = componentReverseMap[parent.id] ?? [];

      componentReverseMap[parent.id] = [
        ...componentReverseMap[parent.id],
        id,
      ].sort((a, b) => {
        return componentStore[a].parent.index - componentStore[b].parent.index;
      });
    } else {
      canvasZoneReverseMap[parent.canvasZoneId] =
        canvasZoneReverseMap[parent.canvasZoneId] ?? [];

      canvasZoneReverseMap[parent.canvasZoneId] = [
        ...canvasZoneReverseMap[parent.canvasZoneId],
        id,
      ].sort((a, b) => {
        return componentStore[a].parent.index - componentStore[b].parent.index;
      });
    }
    // inform the canvas machine
    canvasMachineInterpreter.send({
      type: "COMPONENT_CREATED",
      compId: id,
      canvasZoneId: parent.canvasZoneId,
      parentId: parent.id,
    });
  } else {
    throw Error(
      `Could not find the manifest for pkg=${manifestData.pkg} key=${manifestData.key} in manifestSchmea=${manifestData.manifestSchemaId}`
    );
  }
}

function getCanvasZoneChildrenId(canvasZoneId: string) {
  return canvasZoneReverseMap[canvasZoneId] || [];
}

function getComponentChildrenId(parentId: string) {
  return componentReverseMap[parentId] || [];
}

function getComponent(compId: string): CanvasComponent | undefined {
  return componentStore[compId];
}

function getComponentParent(compId: string) {
  return componentStore[compId].parent;
}

function getCanvasZoneComponent(canvasZoneId: string) {
  return document.querySelector(`[data-atri-canvas-id='${canvasZoneId}']`);
}

function getComponentRef(compId: string) {
  return componentStore[compId].ref;
}

function getComponentProps(compId: string) {
  return { ...componentStore[compId].props };
}

function _getAllDescendants(compId: string) {
  const descendants: string[] = [];
  const childrenId = componentReverseMap[compId] || [];
  descendants.push(...childrenId);
  for (let i = 0; i < childrenId.length; i++) {
    descendants.concat(_getAllDescendants(childrenId[i]));
  }
  return descendants;
}

function getAllDescendants(compId: string) {
  return _getAllDescendants(compId);
}

export const componentStoreApi = {
  createComponent,
  getComponent,
  getCanvasZoneChildrenId,
  getComponentChildrenId,
  getComponentParent,
  getCanvasZoneComponent,
  getComponentRef,
  getComponentProps,
  getAllDescendants,
};
