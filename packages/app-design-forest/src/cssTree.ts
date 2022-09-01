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
  // display values like flex, inline-flex, none
  flexDisplayOptions?: boolean;
  // display values like grid, inline-grid, none
  gridDisplayOptions?: boolean;
  // display values like inline, inline-block, content etc.
  css2DisplayOptions?: boolean;
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
