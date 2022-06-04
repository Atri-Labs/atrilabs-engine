import {
  getOwnCoords,
  getRelativeChildrenCoords,
  getRelativeLocation,
  Location,
} from "@atrilabs/canvas-runtime";
import { computeBodyChildIndex } from "@atrilabs/canvas-runtime-utils";
import { ManifestRegistry } from "@atrilabs/core";
import { Tree } from "@atrilabs/forest";
import { AcceptsChildFunction } from "@atrilabs/react-component-manifest-schema/lib";
import ReactComponentManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";

export function getComponentIndexInsideBody(loc: Location): number {
  const parentId = "body";
  const coords = getOwnCoords(parentId);
  const childCoordinates = getRelativeChildrenCoords(parentId);
  const relativePointerLoc = getRelativeLocation(parentId, loc);
  if (coords && relativePointerLoc) {
    return computeBodyChildIndex({
      coords,
      childCoordinates,
      relativePointerLoc,
    });
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
  const parentManifest = manifestRegistry[
    parentManifestSchemaId
  ].components.find((curr) => {
    return curr.pkg === parentPkg && curr.component.meta.key === parentKey;
  });
  const parentComponent = parentManifest!.component;
  if (!parentComponent.dev.acceptsChild) {
    console.error(
      "Parent manifest component must have a dev.acceptsChild field."
    );
  }
  const acceptsChild: AcceptsChildFunction = parentComponent.dev.acceptsChild;
  const coords = getOwnCoords(caughtBy);
  const childCoordinates = getRelativeChildrenCoords(caughtBy);
  const relativePointerLoc = getRelativeLocation(caughtBy, loc);
  // TODO: send original props
  const props = { styles: {} };
  if (coords && relativePointerLoc) {
    return acceptsChild({
      coords,
      childCoordinates,
      relativePointerLoc,
      props,
    });
  } else {
    console.error(
      `coords & relativePointerLoc were expected to be defined. Please report this error to Atri Labs.`
    );
    return 0;
  }
}
