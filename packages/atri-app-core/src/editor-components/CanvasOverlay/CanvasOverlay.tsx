import { useDragDrop } from "./hooks/useDragDrop";

export function CanvasOverlay() {
  const { dragFC, dragOverlayStyle } = useDragDrop();
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
