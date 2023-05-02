import {AttributesTreeOptions, AttributesTreeOptionsBoolean} from "@atrilabs/app-design-forest";



export type TabBodyProps = {
  patchCb: (slice: any) => void;
  attrs: AttributesTreeOptions;
  treeOptions: AttributesTreeOptionsBoolean;
};
export type ComponentProps = TabBodyProps & {
  propName: string;
  propValue?: string[];
  selector?: (string | number)[];
  routes: string[];
  objectName?: string;
};
export type BasicProps = TabBodyProps & {
  routes: string[];
};
