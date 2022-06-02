import React, { useEffect, useMemo, useReducer } from "react";
import { subscribeCanvasUpdate } from "./CanvasComponentData";
import { DecoratorProps } from "./DecoratorRenderer";

/**
 * MutationDecorator is used with components that cannot accept child.
 * It updates the component whenever a change happens to it.
 */
export const MutationDecorator = (props: DecoratorProps) => {
  const [, forceUpdate] = useReducer((c) => c + 1, 0);
  const compId = useMemo(() => props.compId, [props]);
  useEffect(() => {
    const unsub = subscribeCanvasUpdate(compId, () => {
      console.log("Mutation observed", compId);
      forceUpdate();
    });
    return unsub;
  }, [compId]);
  return <>{props.children}</>;
};
