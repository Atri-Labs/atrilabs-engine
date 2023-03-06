import { DecoratorData } from "../../types";
import { useEffect } from "react";
import { canvasMachineInterpreter } from "../../api";

export function useHasComponentRendered(props: DecoratorData) {
  // TODO
  // DANGER - This hook gets called on every render
  useEffect(() => {
    canvasMachineInterpreter.send({
      type: "COMPONENT_RENDERED",
      compId: props.id,
    });
  });
}
