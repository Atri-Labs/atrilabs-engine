export type CSSTreeOptions = {
  flexContainerOptions: boolean;
  flexChildOptions: boolean;
  topographyOptions: boolean;
  spacingOptions: boolean;
  sizeOptions: boolean;
  borderOptions: boolean;
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
