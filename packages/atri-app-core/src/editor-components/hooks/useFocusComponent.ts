import { DecoratorData } from "../../types";
import { componentStoreApi } from "../../api/componentStoreApi";
import { useEffect } from "react";

export function useFocusComponent(props: DecoratorData) {
  useEffect(() => {
    const ref = componentStoreApi.getComponentRef(props.id);
    if (ref.current) {
      ref.current.tabIndex = 0;
      ref.current.focus();
    }
  }, [props.id]);
}
