import { useState, useEffect } from "react";
import { componentStoreApi, liveApi } from "../../../api";

export function useGetComponentProps(props: { id: string }) {
  const [compProps, setCompProps] = useState<any>(
    componentStoreApi.getComponentProps(props.id)
  );
  useEffect(() => {
    return liveApi.subscribeComponentUpdates(props.id, () => {
      setCompProps(componentStoreApi.getComponentProps(props.id));
    });
  }, [props.id]);
  return compProps;
}
