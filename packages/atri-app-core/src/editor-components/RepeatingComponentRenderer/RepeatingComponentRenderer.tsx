import { canvasApi, componentStoreApi } from "../../api";
import { CanvasComponent, RepeatingComponentRendererProps } from "../../types";
import { useMemo, useEffect, useState } from "react";
import { RepeatingComponentNormalRenderer } from "./childFC/RepeatingComponentNormalRenderer";
import { RepeatingComponentParentRenderer } from "./childFC/RepeatingComponentParentRenderer";

export function RepeatingComponentRenderer(
  props: RepeatingComponentRendererProps
) {
  // create custom data for all children
  const data = () => {
    const { start, end } = componentStoreApi.getComponentProps(props.id).custom;
    const num = end - start;
    const descs = componentStoreApi.getAllDescendants(props.id);
    const descsProps = descs.reduce((curr, desc) => {
      const { props, callbacks, ref, id } =
        componentStoreApi.getComponent(desc)!;
      curr[desc] = { props, callbacks, ref, id };
      return curr;
    }, {} as { [id: string]: Pick<CanvasComponent, "callbacks" | "props" | "ref" | "id"> });
    const data = Array.from(Array(num).keys()).map(() => {
      return descsProps;
    });
    // listen for events for all the child here??
  };
  // create RepeatingComponentParentRenderer <- This will be the children FC
  // create RepeatingComponentNormalRenderer <- This will be the children FC
  const {
    comp: Comp,
    props: compProps,
    ref,
    callbacks,
  } = componentStoreApi.getComponent(props.id)!;

  const [topLevelChildId, setTopLevelChild] = useState<string | null>(null);
  const [topLevelChildAcceptsChild, setTopLevelChildAcceptsChild] = useState<
    boolean | undefined
  >(undefined);
  useEffect(() => {
    canvasApi.subscribeComponentEvent(props.id, "new_component", () => {
      const topLevelChildId =
        componentStoreApi.getComponentChildrenId(props.id)[0] || null;
      let topLevelChildAcceptsChild: boolean | undefined = false;
      if (topLevelChildId) {
        topLevelChildAcceptsChild =
          componentStoreApi.getComponent(topLevelChildId)?.acceptsChild;
      }
      setTopLevelChild(topLevelChildId);
      setTopLevelChildAcceptsChild(topLevelChildAcceptsChild);
    });
  }, []);

  return <Comp {...compProps} ref={ref} {...callbacks}></Comp>;
}
