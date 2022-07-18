export type CustomPropsTreeOptions = {
  dataTypes: {
    [propName: string]: "text" | "number" | "large_text" | "static_asset";
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
