import type { CanvasZoneRendererProps } from "../../types";
import { useLiveApi } from "./hooks/useLiveApi";

export function LiveCanvasZoneRenderer(props: CanvasZoneRendererProps) {
  useLiveApi(props.canvasZoneId);
  return <div>Live Canvas Zone</div>;
}
