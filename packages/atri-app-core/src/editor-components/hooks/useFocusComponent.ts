import { DecoratorData } from "../../types";
import { componentStoreApi } from "../../api/componentStoreApi";
import { useEffect, useState } from "react";
import { subscribeCanvasMachine } from "../../api";

export function useFocusComponent(props: DecoratorData) {
  const [id, setId] = useState("");

  useEffect(() => {
    console.log("State useFocusComponent");
    const setFocus = subscribeCanvasMachine("focus", (context) => {
      setId(context.selected || "");
    });
    return () => {
      setFocus();
    };
  }, [id]);

  useEffect(() => {
    if (props.id === id) {
      const ref = componentStoreApi.getComponentRef(props.id);
      if (ref.current) {
        ref.current.tabIndex = 0;
        ref.current.focus();
        console.log("Running ENter");
      }
    }
  }, [props.id, id]);
}
