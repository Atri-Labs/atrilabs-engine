import { useMemo } from "react";
import { gray500 } from "@atrilabs/design-system";
import { CanvasZoneRendererProps } from "../../types";
import { useCanvasZoneEventSubscriber } from "./hooks/useCanvasZoneEventSubscriber";

export function CanvasZoneRenderer(props: CanvasZoneRendererProps) {
  const { childCompIds } = useCanvasZoneEventSubscriber({
    canvasZoneId: props.canvasZoneId,
  });
  const styles = useMemo(() => {
    if (childCompIds && childCompIds.length === 0) {
      return {
        ...props.styles,
        height: "200px",
        border: `1px solid ${gray500}`,
      };
    }
  }, [props.styles, childCompIds]);
  return (
    <div style={styles} data-canvas-id={props.canvasZoneId}>
      {childCompIds}
    </div>
  );
}
