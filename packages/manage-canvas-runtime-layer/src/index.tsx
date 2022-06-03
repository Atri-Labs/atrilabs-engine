import { useSubscribeDrop } from "./hooks/useSubscribeDrop";
import { useSubscribeEvents } from "./hooks/useSubscribeEvents";
import { useSubscribeNewDrag } from "./hooks/useSubscribeNewDrag";

export default function () {
  console.log("manage-canvas-runtime-layer-loaded");
  useSubscribeDrop();
  useSubscribeEvents();
  useSubscribeNewDrag();
  return <></>;
}
