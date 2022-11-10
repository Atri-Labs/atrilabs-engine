import {
  CustomPropsTreeOptions,
  MapCustomProp,
} from "@atrilabs/app-design-forest/lib/customPropsTree";
import {
  ColorPickerDialogProps,
  OpenAssetManagerCallabck,
} from "@atrilabs/shared-layer-lib";

type attributeTypes =
  | "text"
  | "number"
  | "large_text"
  | "static_asset"
  | "boolean"
  | "color"
  | "internal_link"
  | "external_link";

export type TabBodyProps = {
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
  attributes?: { name: string; type: attributeTypes }[];
};

export type ComponentProps = TabBodyProps & {
  propName: string;
  openAssetManager: OpenAssetManagerCallabck;
  openColorPicker: (
    colorPickerProps: Omit<ColorPickerDialogProps, "onCrossClick">
  ) => void;
  routes: string[];
  objectName?: string;
};
