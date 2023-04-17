import { ParentComponentRendererProps } from "../../types";
import { componentStoreApi } from "../../api";
import { useAssignParentMarker } from "../hooks/useAssignParentMaker";
import { useAssignComponentId } from "../hooks/useAssignComponentId";
import { LiveRepeatingComponentRenderer } from "../LiveRepeatingComponentRenderer/LiveRepeatingComponentRenderer";
import { LiveNormalComponentRenderer } from "../LiveNormalComponentRenderer/LiveNormalComponentRenderer";
import { useGetComponentProps } from "../live-component/hooks/useGetComponentProps";
import { useGetCallbacks } from "../live-component/hooks/useGetCallbacks";
import { useGetComponentRef } from "../hooks/useGetComponentRef";
import { useStyleString } from "../hooks/useStyleString";

export function LiveParentComponentRenderer(
  props: ParentComponentRendererProps
) {
  const { comp: Comp, alias } = componentStoreApi.getComponent(props.id)!;
  const ref = useGetComponentRef({ id: props.id });
  const children = componentStoreApi.getComponentChildrenId(props.id);
  useAssignParentMarker({ id: props.id });
  useAssignComponentId({ id: props.id });
  const compProps = useGetComponentProps({ id: props.id });
  const { styleStr, styles } = useStyleString({ alias, compProps });
  const callbacks = useGetCallbacks({ id: props.id });
  return (
    <>
      <style>{styleStr}</style>
      <Comp
        {...{ ...compProps, styles }}
        ref={ref}
        {...callbacks}
        className={alias}
      >
        {children.map((childId) => {
          const { acceptsChild, isRepeating } =
            componentStoreApi.getComponent(childId)!;
          return acceptsChild ? (
            isRepeating ? (
              <LiveRepeatingComponentRenderer id={childId} key={childId} />
            ) : (
              <LiveParentComponentRenderer id={childId} key={childId} />
            )
          ) : (
            <LiveNormalComponentRenderer id={childId} key={childId} />
          );
        })}
      </Comp>
    </>
  );
}
