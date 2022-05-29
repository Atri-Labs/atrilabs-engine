import { useSubscribeDrop } from "./hooks/useSubscribeDrop";
import { useSubscribeEvents } from "./hooks/useSubscribeEvents";

export default function () {
  useSubscribeDrop();
  useSubscribeEvents();
  return <></>;
}
