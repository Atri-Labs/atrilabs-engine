import { canvasApi, componentStoreApi } from "../../api";
import { RepeatingComponentRendererProps } from "../../types";
import { useMemo, useEffect } from "react";
import { RepeatingComponentNormalRenderer } from "./childFC/RepeatingComponentNormalRenderer";

export function RepeatingComponentRenderer(
  props: RepeatingComponentRendererProps
) {
  // create custom data for all children
  const data = useMemo(() => {
    const { start, end } = componentStoreApi.getComponentProps(props.id).custom;
    const num = end - start;
    const descs = componentStoreApi.getAllDescendants(props.id);
    const descsProps = descs.map((desc) => {
      const { props, callbacks, ref, id } =
        componentStoreApi.getComponent(desc)!;
      return { props, callbacks, ref, id };
    });
    return Array.from(Array(num).keys()).map(() => {
      return descsProps;
    });
  }, [componentStoreApi.getComponentProps(props.id).custom, props.id]);
  // create RepeatingComponentParentRenderer <- This will be the children FC
  // create RepeatingComponentNormalRenderer <- This will be the children FC
  const {
    comp: Comp,
    props: compProps,
    ref,
    callbacks,
  } = componentStoreApi.getComponent(props.id)!;
  useEffect(() => {
    canvasApi.subscribeComponentEvent(props.id, "new_component", () => {
      const topLevelChildId =
        componentStoreApi.getComponentChildrenId(props.id)[0] ?? null;
      let topLevelChildAcceptsChild: boolean | undefined = false;
      if (topLevelChildId) {
        topLevelChildAcceptsChild =
          componentStoreApi.getComponent(topLevelChildId)?.acceptsChild;
      }
    });
  }, []);

  return (
    <Comp
      {...compProps}
      ref={ref}
      {...callbacks}
      ChildFC={RepeatingComponentNormalRenderer}
    />
  );
}
