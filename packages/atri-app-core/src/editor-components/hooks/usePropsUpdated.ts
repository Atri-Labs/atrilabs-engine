import { useEffect, useState } from "react";
import {
  canvasApi,
  canvasMachineInterpreter,
  componentStoreApi,
} from "../../api";

export function usePropsUpdated(props: { id: string }) {
  const [compProps, setCompProps] = useState<any>(
    componentStoreApi.getComponent(props.id)!.props
  );
  useEffect(() => {
    return canvasApi.subscribeComponentEvent(props.id, "props_updated", () => {
      setCompProps(componentStoreApi.getComponentProps(props.id));
    });
  }, []);
  useEffect(() => {
    // this hook will get called only after re-render
    canvasMachineInterpreter.send({
      type: "COMPONENT_RENDERED_AFTER_PROPS_UPDATE",
      id: props.id,
    });
  }, [compProps, props.id]);
  return compProps;
}
