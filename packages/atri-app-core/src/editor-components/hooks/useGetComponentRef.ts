import { useContext } from "react";
import { componentStoreApi } from "../../api";
import { RepeatingContext } from "../../editor-contexts/RepeatingContext";

export function useGetComponentRef(props: { id: string }) {
  const repeatingContextValue = useContext(RepeatingContext);
  if (repeatingContextValue === null) {
    return componentStoreApi.getComponentRef(props.id);
  } else {
    return componentStoreApi.getComponentRef(
      props.id,
      repeatingContextValue.indices,
      repeatingContextValue.lengths
    );
  }
}
