import Joi from "joi";
import { ManifestSchema } from "@atrilabs/core";
import type { FC } from "react";

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
    acceptsChild: boolean;
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
    acceptsChild: Joi.bool(),
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
