import Joi from "joi";
import { ManifestSchema } from "@atrilabs/core";

const schema = Joi.object({
  meta: Joi.object({ key: Joi.string() }),
  render: Joi.object({
    comp: Joi.function(),
    props: Joi.object(),
  }),
  dev: Joi.object({
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
