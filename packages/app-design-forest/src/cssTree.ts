export type CSSTreeOptions = {
  flexContainerOptions: boolean;
  flexChildOptions: boolean;
  positionOptions: boolean;
  typographyOptions: boolean;
  spacingOptions: boolean;
  sizeOptions: boolean;
  borderOptions: boolean;
  backgroundOptions: boolean;
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
