import { NormalComponentRendererProps } from "../../types";
import { componentStoreApi } from "../../api";

export function NormalComponentRenderer(props: NormalComponentRendererProps) {
  const {
    comp: Comp,
    props: compProps,
    ref,
    callbacks,
  } = componentStoreApi.getComponent(props.id)!;
  return <Comp {...compProps} ref={ref} {...callbacks} />;
}
