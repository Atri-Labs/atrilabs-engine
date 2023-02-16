import { componentStoreApi } from "../../api";
import { RepeatingComponentRendererProps } from "../../types";
import { useMemo } from "react";

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
  return;
}
