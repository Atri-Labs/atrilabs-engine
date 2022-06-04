import Joi from "joi";
import { ManifestSchema } from "@atrilabs/core";
import type { FC } from "react";

export type ComponentCoords = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type AcceptsChildFunction = (info: {
  coords: ComponentCoords;
  childCoordinates: ComponentCoords[];
  relativePointerLoc: Pick<ComponentCoords, "top" | "left">;
  props: any;
}) => number;

export type ReactComponentManifestSchema = {
  meta: { key: string };
  render: {
    comp: FC<any>;
  };
  dev: {
    comp?: FC<any>;
    decorators: FC<any>[];
    attachProps: { [key: string]: { treeId: string; initialValue: any } };
    attachCallbacks: { [key: string]: any };
    acceptsChild?: AcceptsChildFunction;
  };
};

const schema = Joi.object({
  meta: Joi.object({ key: Joi.string() }),
  render: Joi.object({
    comp: Joi.function(),
  }),
  dev: Joi.object({
    comp: Joi.function(),
    // TODO: add more details to make schema validation better
    decorators: Joi.array(),
    attachProps: Joi.object(),
    attachCallbacks: Joi.object(),
    acceptsChild: Joi.function(),
  }),
});

export default function (): ManifestSchema {
  function validate(manifest: any) {
    const { error } = schema.validate(manifest);
    if (error) return false;
    else return true;
  }
  return { validate };
}
