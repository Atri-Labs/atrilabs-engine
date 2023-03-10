import { useRef } from "react";
import { callbackFactory } from "../callbackFactory";

export function useGetCallbacks(props: { id: string }) {
  const callbacks = useRef<{ [callbackName: string]: Function }>(
    callbackFactory(props)
  );
  return callbacks.current;
}
