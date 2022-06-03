import { useSubscribeDrop } from "./hooks/useSubscribeDrop";
import { useSubscribeEvents } from "./hooks/useSubscribeEvents";

export default function () {
  console.log("manage-canvas-runtime-layer-loaded");
  useSubscribeDrop();
  useSubscribeEvents();
  return <></>;
}
