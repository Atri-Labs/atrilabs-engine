import {
  getOwnCoords,
  Location,
  getComponentChildrenId,
  getComponentParent,
  ComponentCoordsWM,
  getComponentProps,
} from "@atrilabs/canvas-runtime";
import { computeBodyChildIndex } from "./computeBodyChildIndex";
import { ManifestRegistry, manifestRegistryController } from "@atrilabs/core";
import { Tree } from "@atrilabs/forest";
import { AcceptsChildFunction } from "@atrilabs/react-component-manifest-schema";
import ReactComponentManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";

function computeFactoredIndex(index: number, parentId: string) {
  const childrenId = getComponentChildrenId(parentId);
  if (index === 0 && childrenId.length === 0) {
    return 1;
  } else if (index === 0) {
    // NOTE: we are relying on the fact the getComponentChildrenId will return
    // children id in order
    const childrenId = getComponentChildrenId(parentId);
    const nextSiblingId = childrenId[0];
    const nextSiblingIndex = getComponentParent(nextSiblingId).index;
    const newIndex = nextSiblingIndex / 2;
    return newIndex;
  } else if (index === childrenId.length) {
    const childrenId = getComponentChildrenId(parentId);
    const prevSiblingId = childrenId[index - 1];
    const prevSiblingIndex = getComponentParent(prevSiblingId).index;
    const newIndex = prevSiblingIndex * 2;
    return newIndex;
  } else {
    const childrenId = getComponentChildrenId(parentId);
    const prevSiblingId = childrenId[index - 1];
    const nextSiblingId = childrenId[index];
    const prevSiblingIndex = getComponentParent(prevSiblingId).index;
    const nextSiblingIndex = getComponentParent(nextSiblingId).index;
    const newIndex = (prevSiblingIndex + nextSiblingIndex) / 2;
    return newIndex;
  }
}

export function getComponentIndexInsideBody(loc: Location): number {
  const parentId = "body";
  const coords = getOwnCoords(parentId);
  const childrenId = getComponentChildrenId(parentId);
  const childCoordinates: ComponentCoordsWM[] = [];
  for (let i = 0; i < childrenId.length; i++) {
    const coords = getOwnCoords(childrenId[i]);
    if (coords) {
      childCoordinates.push(coords!);
    }
  }
  if (coords) {
    const index = computeBodyChildIndex({
      coords,
      childCoordinates,
      loc,
    });
    return computeFactoredIndex(index, parentId);
  } else {
    console.error(
      `coords & relativePointerLoc were expected to be defined. Please report this error to Atri Labs.`
    );
    return 0;
  }
}

export function getComponentIndex(
  tree: Tree,
  caughtBy: string,
  loc: Location,
  manifestRegistry: ManifestRegistry
): number {
  const parentMeta = tree.nodes[caughtBy]!.meta;
  const parentPkg = parentMeta.pkg;
  const parentKey = parentMeta.key;
  const parentManifestSchemaId = parentMeta.manifestSchemaId;
  if (parentManifestSchemaId === ReactComponentManifestSchemaId) {
  }
  const parentFullManifest = manifestRegistry[
    parentManifestSchemaId
  ].manifests.find((curr) => {
    return curr.pkg === parentPkg && curr.manifest.meta.key === parentKey;
  });
  const parentManifest = parentFullManifest!.manifest;
  if (!parentManifest.dev.acceptsChild) {
    console.error(
      "Parent manifest component must have a dev.acceptsChild field."
    );
  }
  const acceptsChild: AcceptsChildFunction = parentManifest.dev.acceptsChild;
  const coords = getOwnCoords(caughtBy);
  const childrenId = getComponentChildrenId(caughtBy);
  const childCoordinates: ComponentCoordsWM[] = [];
  for (let i = 0; i < childrenId.length; i++) {
    const coords = getOwnCoords(childrenId[i]);
    if (coords) {
      childCoordinates.push(coords!);
    }
  } // TODO: send original props of parent
  const props = getComponentProps(caughtBy);
  if (coords) {
    const index = acceptsChild({
      coords,
      childCoordinates,
      loc,
      props,
    });
    return computeFactoredIndex(index, caughtBy);
  } else {
    console.error(
      `coords & relativePointerLoc were expected to be defined. Please report this error to Atri Labs.`
    );
    return 0;
  }
}

export function computeChildIndex(parentId: string, loc: Location, tree: Tree) {
  // find manifest from manifest registry
  const manifestRegistry = manifestRegistryController.readManifestRegistry();
  let index = 0;
  if (parentId === "body") {
    index = getComponentIndexInsideBody(loc);
  } else {
    // Don't process if caughtBy/parent does not belong to component tree
    if (!tree.nodes[parentId]) {
      return;
    }
    index = getComponentIndex(tree, parentId, loc, manifestRegistry);
  }
  return index;
}
