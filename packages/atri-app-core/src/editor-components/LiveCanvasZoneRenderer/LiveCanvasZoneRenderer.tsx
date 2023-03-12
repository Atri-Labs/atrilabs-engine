import { componentStoreApi } from "../../api";
import type { CanvasZoneRendererProps } from "../../types";
import { LiveNormalComponentRenderer } from "../LiveNormalComponentRenderer/LiveNormalComponentRenderer";
import { LiveParentComponentRenderer } from "../LiveParentComponentRenderer/LiveParentComponentRenderer";
import { LiveRepeatingComponentRenderer } from "../LiveRepeatingComponentRenderer/LiveRepeatingComponentRenderer";
import { useLiveApi } from "./hooks/useLiveApi";

export function LiveCanvasZoneRenderer(props: CanvasZoneRendererProps) {
  const { directChildrenIds } = useLiveApi(props.canvasZoneId);
  return (
    <div style={props.styles} data-atri-canvas-id={props.canvasZoneId}>
      {directChildrenIds.map((childCompId) => {
        const { acceptsChild, isRepeating } =
          componentStoreApi.getComponent(childCompId)!;
        return acceptsChild ? (
          isRepeating ? (
            <LiveRepeatingComponentRenderer
              id={childCompId}
              key={childCompId}
            />
          ) : (
            <LiveParentComponentRenderer id={childCompId} key={childCompId} />
          )
        ) : (
          <LiveNormalComponentRenderer id={childCompId} key={childCompId} />
        );
      })}
    </div>
  );
}
