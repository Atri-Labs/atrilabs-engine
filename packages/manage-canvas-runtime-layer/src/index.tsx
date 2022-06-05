import { useDeleteKey } from "./hooks/useDeleteKey";
import { useSubscribeNewDrop } from "./hooks/useSubscribeNewDrop";
import { useSubscribeEvents } from "./hooks/useSubscribeEvents";
import { useSubscribeReDrop } from "./hooks/useSubscribeReDrop";

export default function () {
  console.log("manage-canvas-runtime-layer-loaded");
  useSubscribeNewDrop();
  useSubscribeEvents();
  useSubscribeReDrop();
  useDeleteKey();
  return <></>;
}
