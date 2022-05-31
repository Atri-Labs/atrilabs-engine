import { useEffect, useMemo, useReducer, useState } from "react";
import {
  canvasComponentStore,
  canvasComponentTree,
  subscribeCanvasUpdate,
} from "./CanvasComponentData";
import { DecoratorRenderer } from "./DecoratorRenderer";
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
  const [, forceUpdate] = useReducer((c) => c + 1, 0);
  const [childrenId, setChildrenId] = useState<string[]>([]);

  const component = useMemo(() => {
    return canvasComponentStore[props.compId];
  }, [props]);

  useEffect(() => {
    const unsub = subscribeCanvasUpdate(props.compId, () => {
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
      forceUpdate();
    });
    return unsub;
  }, [props, component]);

  /**
   * create component, assign props, link it with it's ref
   */
  return (
    <>
      {
        <component.comp {...component.props} ref={component.ref}>
          {childrenId.map((childId) => {
            const childComp = canvasComponentStore[childId];
            const decorators = childComp.decorators;
            const ref = childComp.ref;
            if (childComp.acceptsChild) {
              return (
                <DecoratorRenderer
                  compId={childId}
                  decorators={decorators}
                  key={childId}
                >
                  <ComponentRenderer compId={childId} />
                </DecoratorRenderer>
              );
            } else {
              return (
                <DecoratorRenderer
                  compId={childId}
                  decorators={decorators}
                  key={childId}
                >
                  <childComp.comp {...childComp.props} ref={ref} />
                </DecoratorRenderer>
              );
            }
          })}
        </component.comp>
      }
    </>
  );
};
