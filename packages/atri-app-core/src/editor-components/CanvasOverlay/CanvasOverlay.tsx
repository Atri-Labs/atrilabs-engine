import {
  useDragDrop,
  useSelectHints,
  useHoverHints,
  useDraggedOverlay,
  useDropzoneAndRepositionHints,
} from "./hooks";

export function CanvasOverlay() {
  const { dragFC, dragOverlayStyle } = useDragDrop();
  useSelectHints();
  useHoverHints();
  useDraggedOverlay();
  useDropzoneAndRepositionHints();
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
