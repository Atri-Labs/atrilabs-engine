import { raiseHoverEvent, raiseSelectEvent } from "@atrilabs/canvas-runtime";
import { useCallback } from "react";
import { useNavigatorNodes } from "../hooks/useComponentNodes";
import { ComponentNavigator } from "./ComponentNavigator";

export const ComponentNavigatorWrapper = () => {
  const { rootNavigatorNode, toggleNode, repositionNavNode } =
    useNavigatorNodes();

  const onNavigatorNodeSelect = useCallback((compId: string) => {
    raiseSelectEvent(compId);
  }, []);

  const onNavigatorNodeHover = useCallback((compId: string) => {
    raiseHoverEvent(compId);
  }, []);

  const onChange = useCallback(
    (change: { id: string; parentId: string; index: number }) => {
      // call reposition navigator node
      repositionNavNode(change.id, change.parentId, change.index);
    },
    [repositionNavNode]
  );
  return (
    <>
      {rootNavigatorNode !== null ? (
        <ComponentNavigator
          rootNode={rootNavigatorNode}
          onToggleOpen={toggleNode}
          onSelect={onNavigatorNodeSelect}
          onHover={onNavigatorNodeHover}
          onChange={onChange}
        />
      ) : null}
    </>
  );
};
