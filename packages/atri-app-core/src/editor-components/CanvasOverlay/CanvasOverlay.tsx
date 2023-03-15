import {
  useDragDrop,
  useSelectHints,
  useHoverHints,
  useDraggedOverlay,
  useDropzoneHints,
} from "./hooks";

export function CanvasOverlay() {
  const { dragFC, dragOverlayStyle } = useDragDrop();
  useSelectHints();
  useHoverHints();
  useDraggedOverlay();
  useDropzoneHints();
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
