import {AttributesTreeOptions, CustomPropsTreeOptions} from "@atrilabs/app-design-forest";



export type TabBodyProps = {
  patchCb: (slice: any) => void;
  attrs: AttributesTreeOptions;
};
export type ComponentProps = TabBodyProps & {
  propName: string;
  propValue?: string[];
  selector?: (string | number)[];
  routes: string[];
  objectName?: string;
};
