import { useSubscribeDrop } from "./hooks/useSubscribeDrop";
import { useSubscribeEvents } from "./hooks/useSubscribeEvents";
import { useSubscribeReDrop } from "./hooks/useSubscribeReDrop";

export default function () {
  console.log("manage-canvas-runtime-layer-loaded");
  useSubscribeDrop();
  useSubscribeEvents();
  useSubscribeReDrop();
  return <></>;
}
