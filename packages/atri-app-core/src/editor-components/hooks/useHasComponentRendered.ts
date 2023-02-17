import { DecoratorData } from "../../types";
import { useEffect, useState } from "react";
import { canvasMachineInterpreter } from "../../api";

export function useHasComponentRendered(props: DecoratorData) {
  useEffect(() => {
    canvasMachineInterpreter.send({
      type: "COMPONENT_RENDERED",
      compId: props.id,
    });
  }, [props.id]);
}
