export type ComponentNode = {
  type: "acceptsChild" | "normal";
  id: string;
  name: string;
  children?: ComponentNode[];
  open: boolean;
};
