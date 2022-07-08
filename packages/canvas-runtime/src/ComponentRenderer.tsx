import React, { useEffect, useMemo, useReducer, useState } from "react";
import {
  callCanvasComponentRenderedSubscribers,
  canvasComponentStore,
  canvasComponentTree,
  subscribeCanvasUpdate,
} from "./CanvasComponentData";
import { DecoratorRenderer } from "./DecoratorRenderer";
import { dudCallback } from "./utils";
export type ComponentRendererProps = {
  compId: string;
};

/**
 * ComponentRenderer wraps around components that take children.
 * You can consider it kind of similar to a decorator with some differences.
 */
export const ComponentRenderer: React.FC<ComponentRendererProps> = (props) => {
  // whenver there is a change in the component such as prop change, or new child added etc.
  // the component is force re-rendered
  const [updateNum, setUpdateNum] = useReducer((c) => c + 1, 0);
  const [childrenId, setChildrenId] = useState<string[]>([]);

  const component = canvasComponentStore[props.compId];
  const componentCallbacks = useMemo(() => {
    const callbacks: { [callbackName: string]: () => void } = {};
    const callbackNames = Object.keys(component.callbacks);
    callbackNames.forEach((callbackName) => {
      callbacks[callbackName] = dudCallback;
    });
    return callbacks;
  }, [component]);

  // It might happen that children have already been stored in the componentTree
  // when this parent component was created, hence, this useEffect just checks
  // & renders existing children in the componentTree.
  useEffect(() => {
    if (canvasComponentTree[props.compId]) {
      const childrenId = canvasComponentTree[props.compId];
      if (childrenId) {
        // set children array again
        setChildrenId([...childrenId]);
      } else {
        // set to empty array if no children
        setChildrenId([]);
      }
    }
  }, [props]);

  useEffect(() => {
    const unsub = subscribeCanvasUpdate(props.compId, () => {
      const component = canvasComponentStore[props.compId];
      if (component.acceptsChild) {
        const childrenId = canvasComponentTree[props.compId];
        if (childrenId) {
          // set children array again
          setChildrenId([...childrenId]);
        } else {
          // set to empty array if no children
          setChildrenId([]);
        }
      }
      setUpdateNum();
    });
    return unsub;
  }, [props]);

  useEffect(() => {
    callCanvasComponentRenderedSubscribers(props.compId, updateNum);
  }, [props.compId, updateNum]);

  /**
   * create component, assign props, link it with it's ref
   */
  return (
    <component.comp
      {...component.props}
      ref={component.ref}
      {...componentCallbacks}
    >
      {childrenId.map((childId) => {
        return (
          <DecoratorRenderer
            compId={childId}
            decoratorIndex={0}
            key={childId}
          />
        );
      })}
    </component.comp>
  );
};
