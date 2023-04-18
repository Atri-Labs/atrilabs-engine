import { useState, useEffect, useContext } from "react";
import { componentStoreApi, liveApi } from "../../../api";
import { RepeatingContext } from "../../../editor-contexts/RepeatingContext";
import { getPropsForRepeatingChild } from "../getPropsForRepeatingChild";

export function useGetComponentProps(props: { id: string }) {
  const repeatingContext = useContext(RepeatingContext);
  const [compProps, setCompProps] = useState<any>(
    repeatingContext
      ? getPropsForRepeatingChild(props.id, repeatingContext)
      : componentStoreApi.getComponentProps(props.id)
  );
  useEffect(() => {
    return liveApi.subscribeComponentUpdates(props.id, () => {
      setCompProps(
        repeatingContext
          ? getPropsForRepeatingChild(props.id, repeatingContext)
          : componentStoreApi.getComponentProps(props.id)
      );
    });
  }, [props.id]);
  return compProps;
}
