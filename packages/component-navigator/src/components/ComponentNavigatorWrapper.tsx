import { raiseHoverEvent, raiseSelectEvent } from "@atrilabs/canvas-runtime";
import { useCallback } from "react";
import { useNavigatorNodes } from "../hooks/useComponentNodes";
import { ComponentNavigator } from "./ComponentNavigator";

export const ComponentNavigatorWrapper = () => {
  const { rootNavigatorNode, toggleNode, patchCb } = useNavigatorNodes();

  const onNavigatorNodeSelect = useCallback((compId: string) => {
    raiseSelectEvent(compId);
  }, []);

  const onNavigatorNodeHover = useCallback((compId: string) => {
    raiseHoverEvent(compId);
  }, []);

  const onReposition = useCallback(
    (change: { id: string; parentId: string; index: number }) => {
      patchCb(change.id, change.parentId, change.index);
    },
    [patchCb]
  );
  return (
    <>
      {rootNavigatorNode !== null ? (
        <ComponentNavigator
          rootNode={rootNavigatorNode}
          onToggleOpen={toggleNode}
          onSelect={onNavigatorNodeSelect}
          onHover={onNavigatorNodeHover}
          onChange={onReposition}
        />
      ) : null}
    </>
  );
};
