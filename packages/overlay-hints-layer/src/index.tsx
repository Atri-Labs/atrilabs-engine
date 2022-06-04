import { useHoverOverlay } from "./overlays/useHoverOverlay";
import { useSelectOverlay } from "./overlays/useSelectOverlay";
import { useHoverWhileSelectedOverlay } from "./overlays/useHoverWhileSelectedOverlay";
import { useSubscribeNewDrag } from "./overlays/useSubscribeNewDrag";
import { useDropzoneOverlay } from "./overlays/useDropzoneOverlay";
import { useDraggedOverlay } from "./overlays/useDraggedOverlay";

export default function () {
  // overlays during hover
  useHoverOverlay();
  // overlays for a selected component
  useSelectOverlay();
  // overlays for a component hovered while other is selected
  useHoverWhileSelectedOverlay();
  // overlays new parent during reposition
  useDropzoneOverlay();
  // overlays the component being dragged with opacity box
  useDraggedOverlay();
  // shows overlays on the parent of new component being dropped
  useSubscribeNewDrag();
  return <></>;
}
