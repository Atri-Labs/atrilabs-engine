import { useEffect, useMemo, useReducer } from "react";
import { subscribeCanvasUpdate } from "./CanvasComponentData";
import { DecoratorProps, DecoratorRenderer } from "./DecoratorRenderer";

const canvasComponentRenderedSubscribers: ((
  compId: string,
  updateNum: number
) => void)[] = [];
export function subscribeOnComponentRendered(
  cb: (compId: string, updateNum: number) => void
) {
  canvasComponentRenderedSubscribers.push(cb);
  return () => {
    const index = canvasComponentRenderedSubscribers.findIndex(
      (curr) => curr === cb
    );
    if (index >= 0) {
      canvasComponentRenderedSubscribers.splice(index, 1);
    }
  };
}
function callCanvasComponentRenderedSubscribers(
  compId: string,
  updateNum: number
) {
  canvasComponentRenderedSubscribers.forEach((cb) => cb(compId, updateNum));
}

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
