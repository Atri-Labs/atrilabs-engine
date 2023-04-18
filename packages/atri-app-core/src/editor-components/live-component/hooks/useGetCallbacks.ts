import { useRef, useContext, useMemo } from "react";
import { callbackFactory } from "../callbackFactory";
import { RepeatingContext } from "../../../editor-contexts/RepeatingContext";
import { getAliasForAncestors } from "../getAliasForAncestors";
import { getPropsForAncestors } from "../getPropsForAncestors";

export function useGetCallbacks(props: { id: string }) {
  const repeatingContextData = useContext(RepeatingContext);
  const callbacks = useMemo(() => {
    if (repeatingContextData) {
      const comps = getAliasForAncestors(repeatingContextData);
      const data = getPropsForAncestors(repeatingContextData);
      return callbackFactory({ id: props.id, repeating: { comps, data } });
    }
    return callbackFactory(props);
  }, [repeatingContextData, props.id]);
  return callbacks;
}
