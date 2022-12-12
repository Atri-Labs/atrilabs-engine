import {
  ArrayEnumCustomProp,
  ArrayMapCustomProp,
  CustomPropsTreeOptions,
  EnumCustomProp,
  MapCustomProp,
  SimpleCustomProp,
  TypedMapCustomProp,
  VariableKeyMapCustomProp,
} from "@atrilabs/app-design-forest/lib/customPropsTree";
import {
  ColorPickerDialogProps,
  OpenAssetManagerCallabck,
} from "@atrilabs/shared-layer-lib";

type AttributeTypes = TypedMapCustomProp["attributes"];

export type TabBodyProps = {
  // propType?: string;
  patchCb: (slice: any) => void;
  customProps: any;
  treeOptions: CustomPropsTreeOptions;
  openAssetManager: OpenAssetManagerCallabck;
  openColorPicker: (
    colorPickerProps: Omit<ColorPickerDialogProps, "onCrossClick">
  ) => void;
  // options is currently being used with the enum custom property
  options?: string[];
  // attributes is currently being used with the map custom property
  attributes?: AttributeTypes;
  singleObjectName?: string;
};

export type ComponentProps = TabBodyProps & {
  propName: string;
  selector?: (string | number)[];
  openAssetManager: OpenAssetManagerCallabck;
  openColorPicker: (
    colorPickerProps: Omit<ColorPickerDialogProps, "onCrossClick">
  ) => void;
  routes: string[];
  objectName?: string;
};

export type CommonPropTypeContainerTypes = ComponentProps & {
  propType: string;
};

export type AttributeType = {
  type:
    | SimpleCustomProp["type"]
    | MapCustomProp["type"]
    | EnumCustomProp["type"]
    | ArrayEnumCustomProp["type"]
    | ArrayMapCustomProp["type"]
    | VariableKeyMapCustomProp["type"]
    | TypedMapCustomProp["type"]
    | "none";
  fieldName: string;
  options?: string[];
  attributes?: TypedMapCustomProp["attributes"];
};
