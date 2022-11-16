export type SimpleCustomProp = {
  type:
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
    | "external_link";
};

export type EnumCustomProp = {
  type: "enum" | "array_enum";
  options: string[];
};

export type MapCustomProp = {
  type: "map" | "array_map";
  attributes: {
    fieldName: string;
    type: SimpleCustomProp["type"] | EnumCustomProp["type"];
    options?: string[];
  }[];
};

export type CustomPropsTreeOptions = {
  dataTypes: {
    [propName: string]: SimpleCustomProp | MapCustomProp | EnumCustomProp;
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
