import { useDragDrop, useSelectHints } from "./hooks";
import { useHoverHints } from "./hooks/useHoverEvents";

export function CanvasOverlay() {
  const { dragFC, dragOverlayStyle } = useDragDrop();
  useSelectHints();
  useHoverHints();
  return (
    <>
      {dragFC?.Comp && dragOverlayStyle ? (
        <div style={dragOverlayStyle}>
          <dragFC.Comp {...dragFC.props} />
        </div>
      ) : null}
    </>
  );
}
