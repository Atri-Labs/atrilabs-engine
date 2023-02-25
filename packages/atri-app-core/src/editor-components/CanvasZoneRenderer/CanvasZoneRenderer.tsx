import { useMemo } from "react";
import { gray500 } from "@atrilabs/design-system";
import { CanvasZoneRendererProps } from "../../types";
import { useCanvasZoneEventSubscriber } from "./hooks/useCanvasZoneEventSubscriber";
import { componentStoreApi } from "../../api";
import { NormalComponentRenderer } from "../NormalComponentRenderer/NormalComponentRenderer";
import { ParentComponentRenderer } from "../ParentComponentRenderer/ParentComponentRenderer";
import { RepeatingComponentRenderer } from "../RepeatingComponentRenderer/RepeatingComponentRenderer";
import { useHintOverlays } from "../VisualHints/useHintOverlays";

export function CanvasZoneRenderer(props: CanvasZoneRendererProps) {
  const { childCompIds } = useCanvasZoneEventSubscriber({
    canvasZoneId: props.canvasZoneId,
  });
  const styles = useMemo(() => {
    if (childCompIds === undefined || childCompIds.length === 0) {
      return {
        ...props.styles,
        height: "200px",
        border: `1px solid ${gray500}`,
        position: "relative" as const,
      };
    }
    return { ...props.styles, position: "relative" as const };
  }, [props.styles, childCompIds]);

  const hintOverlayNodes = useHintOverlays(props.canvasZoneId);

  return (
    <div style={styles} data-atri-canvas-id={props.canvasZoneId}>
      {childCompIds.map((childCompId) => {
        const { acceptsChild, isRepeating } =
          componentStoreApi.getComponent(childCompId)!;
        return acceptsChild ? (
          isRepeating ? (
            <RepeatingComponentRenderer id={childCompId} key={childCompId} />
          ) : (
            <ParentComponentRenderer id={childCompId} key={childCompId} />
          )
        ) : (
          <NormalComponentRenderer id={childCompId} key={childCompId} />
        );
      })}
      <div style={{ position: "absolute", height: "100%", top: 0, left: 0 }}>
        {hintOverlayNodes}
      </div>
    </div>
  );
}
