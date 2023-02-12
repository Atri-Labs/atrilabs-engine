import { ParentComponentRendererProps } from "../../types";
import { componentStoreApi } from "../../api";
import { NormalComponentRenderer } from "../NormalComponentRenderer/NormalComponentRenderer";

export function ParentComponentRenderer(props: ParentComponentRendererProps) {
  const {
    comp: Comp,
    props: compProps,
    ref,
    callbacks,
  } = componentStoreApi.getComponent(props.id)!;
  const children = componentStoreApi.getComponentChildrendId(props.id);
  return (
    <Comp {...compProps} ref={ref} {...callbacks}>
      {children.map((childId) => {
        const { acceptsChild } = componentStoreApi.getComponent(childId)!;
        return acceptsChild ? (
          <ParentComponentRenderer id={childId} key={childId} />
        ) : (
          <NormalComponentRenderer id={childId} key={childId} />
        );
      })}
    </Comp>
  );
}
