import { useMemo } from "react";
import { canvasComponentStore } from "./CanvasComponentData";
export type ComponentRendererProps = {
  compId: string;
};

export const ComponentRenderer: React.FC<ComponentRendererProps> = (props) => {
  const component = useMemo(() => {
    return canvasComponentStore[props.compId];
  }, [props]);

  /**
   * create component, assign props, link it with it's ref
   */
  return (
    <>
      {
        <component.comp
          {...component.props}
          ref={component.ref}
        ></component.comp>
      }
    </>
  );
};
