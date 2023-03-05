import { useCallback, useRef, MouseEvent, useEffect } from "react";
import {
  getMachineState,
  sendClosedNodeEvent,
  sendMouseDownEvent,
  sendMouseMoveEvent,
  sendMouseUpEvent,
  subscribeDragEnd,
  subscribeReposition,
  subscribeWait,
  waitingForNodesToClose,
} from "../dragDropMachine";
import { NavigatorNode } from "../types";
import { getHoverIndex } from "../utils";
import { TabbedContent } from "./TabbedContent";

export type ComponentNavigatorProps = {
  flattenedNodes: NavigatorNode[];
  // Call onChange everytime the selected node is repositioned
  onChange?: (change: {
    id: string;
    parentId: string;
    index: number;
    oldNavIndex: number;
    movement: 1 | 0 | -1;
  }) => void;
  // Call onHover everytime user hovers over a component
  onHover?: (id: string) => void;
  // Call onSelect everytime user clicks on a component
  onSelect?: (id: string) => void;
  // Call onDragStart whenever the drag process starts
  onDragStart?: (id: string) => void;
  // Call onDragEnd whenever the drag process stops
  onDragEnd?: (draggedNode: NavigatorNode) => void;
  // Open or close a subtree
  onToggleOpen?: (id: string) => void;
};

export const ComponentNavigator: React.FC<ComponentNavigatorProps> = (
  props
) => {
  // TODO: maybe sub-optimal to keep this function call outside
  const flattenedNodes = props.flattenedNodes;

  const ref = useRef<HTMLDivElement | null>(null);
  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (ref.current) {
        const { y } = ref.current.getBoundingClientRect();
        const netY = event.clientY - y + ref.current.scrollTop;
        const hoverIndex = Math.floor(netY / 24);
        if (hoverIndex < flattenedNodes.length && hoverIndex >= 0) {
          props.onHover?.(flattenedNodes[hoverIndex].id);
        }
        sendMouseMoveEvent(event, flattenedNodes);
      }
    },
    [props, flattenedNodes]
  );
  const onMouseDown = useCallback(
    (event: MouseEvent) => {
      sendMouseDownEvent(flattenedNodes, event, ref);
    },
    [flattenedNodes]
  );

  const onMouseUp = useCallback((event: MouseEvent) => {
    sendMouseUpEvent();
  }, []);

  const onClick = useCallback(
    (event: MouseEvent) => {
      if (ref.current) {
        const hoverIndex = getHoverIndex(ref, event);
        if (hoverIndex !== undefined && hoverIndex < flattenedNodes.length) {
          props.onSelect?.(flattenedNodes[hoverIndex].id);
        }
      }
    },
    [props, flattenedNodes]
  );

  const machineState = getMachineState();
  if (machineState.value === waitingForNodesToClose) {
    const { draggedNode, draggedNodeIndexInFlattenedArray } =
      machineState.context;
    if (draggedNode?.open) {
      props.onToggleOpen?.(draggedNode.id);
    } else {
      sendClosedNodeEvent(
        flattenedNodes,
        draggedNodeIndexInFlattenedArray!,
        ref
      );
    }
  }

  useEffect(() => {
    const unsub = subscribeWait((context) => {
      const { draggedNode } = context;
      if (draggedNode?.open) {
        props.onToggleOpen?.(draggedNode.id);
      }
    });
    return unsub;
  }, [props]);

  useEffect(() => {
    const unsub = subscribeReposition(
      (id, parentId, index, oldNavIndex, movement) => {
        props.onChange?.({ id, parentId, index, oldNavIndex, movement });
      }
    );
    return unsub;
  }, [props]);

  useEffect(() => {
    const unsub = subscribeDragEnd((draggedNode) => {
      props.onDragEnd?.(draggedNode);
    });
    return unsub;
  }, [props]);

  return (
    <div
      onMouseMove={onMouseMove}
      onClick={onClick}
      ref={ref}
      style={{ overflow: "auto", boxSizing: "border-box" }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {flattenedNodes.map((node) => {
        const showCaret = node.type === "acceptsChild";
        return (
          <TabbedContent
            key={node.id}
            id={node.id}
            name={node.name}
            tabs={node.depth}
            showDownCaret={showCaret ? node.open : undefined}
            showRightCaret={showCaret ? !node.open : undefined}
            onCaretClicked={(id) => {
              props.onToggleOpen?.(id);
            }}
          />
        );
      })}
    </div>
  );
};
