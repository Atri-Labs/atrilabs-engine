import { useDeleteKey } from "./hooks/useDeleteKey";
import { useSubscribeNewDrop } from "./hooks/useSubscribeNewDrop";
import { useSubscribeEvents } from "./hooks/useSubscribeEvents";
import { useSubscribeReDrop } from "./hooks/useSubscribeReDrop";
import { useSubscribeTemplateDrop } from "./hooks/useSubscribeTemplateDrop";

export default function () {
  console.log("manage-canvas-runtime-layer-loaded");
  useSubscribeNewDrop();
  useSubscribeEvents();
  useSubscribeReDrop();
  useDeleteKey();
  useSubscribeTemplateDrop();
  return <></>;
}
