import React, { MouseEvent } from "react";
import { NavigatorNode } from "../types";
import { TabbedContent } from "./TabbedContent";

export type ComponentNavigatorProps = {
  flattenedNodes: NavigatorNode[];
  // Open or close a subtree
  onToggleOpen?: (navigatorNode: NavigatorNode) => void;
  onMouseMove?: (ev: MouseEvent) => void;
  onMouseDown?: (ev: MouseEvent) => void;
  onMouseUp?: (ev: MouseEvent) => void;
  onClick?: (ev: MouseEvent) => void;
};

export const ComponentNavigator = React.forwardRef<
  HTMLDivElement,
  ComponentNavigatorProps
>((props, ref) => {
  // TODO: maybe sub-optimal to keep this function call outside
  const flattenedNodes = props.flattenedNodes;

  return (
    <div
      onMouseMove={props.onMouseMove}
      onClick={props.onClick}
      ref={ref}
      style={{ overflow: "auto", boxSizing: "border-box" }}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
    >
      {flattenedNodes.map((node) => {
        const showCaret =
          node.type === "acceptsChild" || node.type === "canvasZone";
        return (
          <TabbedContent
            key={node.id}
            id={node.id}
            name={node.name}
            tabs={node.depth}
            showDownCaret={showCaret ? node.open : undefined}
            showRightCaret={showCaret ? !node.open : undefined}
            onCaretClicked={() => {
              props.onToggleOpen?.(node);
            }}
          />
        );
      })}
    </div>
  );
});
