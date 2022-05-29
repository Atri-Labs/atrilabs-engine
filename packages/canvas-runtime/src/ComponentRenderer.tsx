import { useEffect, useMemo, useReducer, useState } from "react";
import {
  canvasComponentStore,
  canvasComponentTree,
  subscribeCanvasUpdate,
} from "./CanvasComponentData";
export type ComponentRendererProps = {
  compId: string;
};

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
      /**
       * re-read all the properties from state
       */
      // set children array again
      setChildrenId([...canvasComponentTree[props.compId]]);
      forceUpdate();
    });
    return unsub;
  }, [props]);

  /**
   * create component, assign props, link it with it's ref
   */
  return (
    <>
      {
        <component.comp {...component.props} ref={component.ref}>
          {childrenId.map((childId) => {
            return childId;
          })}
        </component.comp>
      }
    </>
  );
};
