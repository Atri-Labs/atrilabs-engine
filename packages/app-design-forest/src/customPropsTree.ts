export type CustomPropsTreeOptions = {
  dataTypes: {
    [propName: string]:
      | "text"
      | "number"
      | "large_text"
      | "static_asset"
      | "boolean"
      | "array"
      | "color"
      | "array_boolean"
      | "array_number"
      | "array_static_asset"
      | "internal_link"
      | "component_selector"
      | "map";
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
