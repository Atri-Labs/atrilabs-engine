export type AttributesTreeOptions = {
  attrs: {
    id: string;
    "aria-labelledby": string;
    class: string;
  };
};

export default function () {
  const validateCreate = () => {
    return true;
  };
  const validatePatch = () => {
    return true;
  };
  const onCreate = () => {
    return true;
  };
  return { validateCreate, validatePatch, onCreate };
}
