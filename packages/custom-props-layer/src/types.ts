import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import { OpenAssetManagerCallabck } from "@atrilabs/shared-layer-lib";

export type TabBodyProps = {
  patchCb: (slice: any) => void;
  customProps: any;
  treeOptions: CustomPropsTreeOptions;
  openAssetManager: OpenAssetManagerCallabck;
};

export type ComponentProps = TabBodyProps & {
  propName: string;
  openAssetManager: OpenAssetManagerCallabck;
};
