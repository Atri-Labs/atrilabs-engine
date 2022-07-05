import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";

export type TabBodyProps = {
  patchCb: (slice: any) => void;
  customProps: any;
  treeOptions: CustomPropsTreeOptions;
};

export type ComponentProps = TabBodyProps & {
  propName: string;
};
