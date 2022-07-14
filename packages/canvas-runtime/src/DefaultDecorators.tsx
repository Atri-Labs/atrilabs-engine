import { useEffect, useMemo, useReducer } from "react";
import {
  callCanvasComponentRenderedSubscribers,
  subscribeCanvasUpdate,
} from "./CanvasComponentData";
import { DecoratorProps, DecoratorRenderer } from "./DecoratorRenderer";

/**
 * MutationDecorator is used with components that cannot accept child.
 * It updates the component whenever a change happens to it.
 */
export const MutationDecorator = (props: DecoratorProps) => {
  const [updateNum, setUpdateNum] = useReducer((c) => c + 1, 0);
  const compId = useMemo(() => props.compId, [props]);
  useEffect(() => {
    const unsub = subscribeCanvasUpdate(compId, () => {
      console.log("Mutation observed", compId);
      setUpdateNum();
    });
    return unsub;
  }, [compId]);
  useEffect(() => {
    callCanvasComponentRenderedSubscribers(compId, updateNum);
  }, [compId, updateNum]);
  return <DecoratorRenderer {...props} />;
};
