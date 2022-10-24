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

// export type DragComp = { comp: React.FC<any>; props: any };

export type DragData = {
  id: string;
  parentId: string;
  currentIndex: number;
};

export type StartDragArgs = {
  dragData: DragData;
  lastY: number;
};

export type FilledLineProps = {
  fill: string;
};

export const START_DRAG_CALLED = "START_DRAG_CALLED" as "START_DRAG_CALLED";
export const MOUSE_MOVE = "MOUSE_MOVE" as "MOUSE_MOVE";
export const MOUSE_UP = "MOUSE_UP" as "MOUSE_UP";
export const DROPPED = "DROPPED" as "DROPPED";

export type DragDropMachineEvent =
  | {
      type: "START_DRAG_CALLED";
      args: StartDragArgs;
    }
  | { type: "MOUSE_MOVE"; args: { lastY: number } }
  | { type: "MOUSE_UP" }
  | { type: "DROPPED"; args: StartDragArgs };

export type DragDropMachineContext = {
  startDragArgs: StartDragArgs | null;
  lastY: number | null;
};

export const idle = "idle";
export const DRAG_START = "DRAG_START";
export const DRAG = "DRAG";
