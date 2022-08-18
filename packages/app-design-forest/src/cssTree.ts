export type CSSTreeOptions = {
  flexContainerOptions: boolean;
  flexChildOptions: boolean;
  positionOptions: boolean;
  typographyOptions: boolean;
  spacingOptions: boolean;
  sizeOptions: boolean;
  borderOptions: boolean;
  outlineOptions: boolean;
  backgroundOptions: boolean;
  miscellaneousOptions: boolean;
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
