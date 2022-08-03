import { CallbackHandler } from "@atrilabs/react-component-manifest-schema/lib/types";

export type TabBodyProps = {
  patchCb: (slice: any) => void;
  compId: string;
  // comes from component tree
  callbacks: { [callbackName: string]: CallbackHandler };
  // comes from component manifest
  callbackNames: string[];
};

export const TabBody: React.FC<TabBodyProps> = () => {
  return <div></div>;
};
