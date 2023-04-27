export type AttributesTreeOptions = {
  id: string;
  "aria-labelledby": string;
  class: string;
};
export type AttributesTreeOptionsBoolean = {
  basics: boolean;
  ariaLabelledBy: boolean;
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
  return {validateCreate, validatePatch, onCreate};
}
