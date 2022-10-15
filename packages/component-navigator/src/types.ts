export type NavigatorNode = {
  // whether the component can take children or not
  type: "acceptsChild" | "normal";
  // id of component
  id: string;
  // name to display for this node
  name: string;
  // children of this node
  children?: NavigatorNode[];
  // integer index of this node in it's parent
  index: number;
  // is this node open/close
  open: boolean;
  // parentNode is null for body
  parentNode: NavigatorNode | null;
};
