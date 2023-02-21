import { useEffect, useState } from "react";
import { canvasApi, componentStoreApi } from "../../api";

export function usePropsUpdated(props: { id: string }) {
  const [compProps, setCompProps] = useState<any>();
  useEffect(() => {
    return canvasApi.subscribeComponentEvent(props.id, "props_updated", () => {
      setCompProps(componentStoreApi.getComponentProps(props.id));
    });
  }, []);
  return compProps;
}
