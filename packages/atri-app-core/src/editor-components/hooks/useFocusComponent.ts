import { DecoratorData } from "../../types";
import { componentStoreApi } from "../../api/componentStoreApi";
import { useEffect } from "react";
import { subscribeCanvasMachine } from "../../api";

export function useFocusComponent(props: DecoratorData) {
  useEffect(() => {
    return subscribeCanvasMachine("focus", (context) => {
      if (props.id === context.selected) {
        const ref = componentStoreApi.getComponentRef(props.id);
        if (ref.current) {
          ref.current.tabIndex = 0;
          ref.current.focus();
          console.log("Running ENter");
        }
      }
    });
  }, [props.id]);
}
