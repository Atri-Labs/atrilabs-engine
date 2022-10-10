export type ComponentNode = {
  type: "acceptsChild" | "normal";
  id: string;
  name: string;
  children?: ComponentNode[];
  index: number;
  open: boolean;
};
