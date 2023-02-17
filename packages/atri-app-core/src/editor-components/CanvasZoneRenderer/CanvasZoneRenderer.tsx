import { useMemo } from "react";
import { gray500 } from "@atrilabs/design-system";
import { CanvasZoneRendererProps } from "../../types";
import { useCanvasZoneEventSubscriber } from "./hooks/useCanvasZoneEventSubscriber";
import { componentStoreApi } from "../../api";
import { NormalComponentRenderer } from "../NormalComponentRenderer/NormalComponentRenderer";
import { ParentComponentRenderer } from "../ParentComponentRenderer/ParentComponentRenderer";
import { RepeatingComponentRenderer } from "../RepeatingComponentRenderer/RepeatingComponentRenderer";

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
      };
    }
  }, [props.styles, childCompIds]);
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
    </div>
  );
}
