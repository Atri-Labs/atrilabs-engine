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
  type: "enum";
  options: string[];
};

export type ArrayEnumCustomProp = {
  type: "array_enum";
  options: EnumCustomProp["options"];
};

export type MapCustomProp = {
  type: "map";
  attributes: ({
    fieldName: string;
  } & (SimpleCustomProp | EnumCustomProp))[];
};

export type ArrayMapCustomProp = {
  type: "array_map";
  singleObjectName?: string;
  attributes: MapCustomProp["attributes"];
};

/**
 * This type represents a custom field that takes an object as a value.
 * This object does not have fixed keys unlike MapCustomProp.
 */
export type VariableKeyMapCustomProp = {
  type: "variable_key_map";
  attributes: MapCustomProp["attributes"];
};

export type TypedMapCustomProp = {
  type: "typed_map";
  attributes: ({
    fieldName: string;
  } & (
    | SimpleCustomProp
    | EnumCustomProp
    | ArrayEnumCustomProp
    | MapCustomProp
    | ArrayMapCustomProp
  ))[];
  selectedOption?: string;
};

export type ArrayTypedMapCustomProp = {
  type: "array_typed_map";
  attributes: TypedMapCustomProp["attributes"];
  selectedOption?: string;
};

export type CustomPropsTreeOptions = {
  dataTypes: {
    [propName: string]:
      | SimpleCustomProp
      | MapCustomProp
      | EnumCustomProp
      | ArrayEnumCustomProp
      | ArrayMapCustomProp
      | VariableKeyMapCustomProp
      | TypedMapCustomProp
      | ArrayTypedMapCustomProp;
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
