import Joi from "joi";

const schema = Joi.object({
  panel: Joi.object({ comp: Joi.function(), props: Joi.object() }),
  drag: Joi.object({ comp: Joi.function(), props: Joi.object() }),
  renderSchema: Joi.object(),
});
/**
 *
 * @returns {ManifestSchema}
 */
export default function () {
  function validate(manifest: any) {
    const { error } = schema.validate(manifest);
    if (error) return false;
    else return true;
  }
  return { validate };
}
