import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";
import { createObject } from "@atrilabs/canvas-runtime-utils/src/utils";
import ControlledInput from "./ControlledInput";

/*
  large text custom prop is used in cases where a component needs a big textbox.
  Example: Large text is used in Modal component.
           body: { type: "large_text" }
*/

export const LargeText: React.FC<ComponentProps> = (props) => {
  const selector = useMemo(() => {
    return props.selector || [];
  }, [props]);

  const propValue = useMemo(() => {
    let currentValue = props.customProps;
    for (let prop of selector) {
      currentValue = currentValue[prop];
      if (currentValue === undefined) break;
    }
    return currentValue || "";
  }, [props, selector]);

  const callPatchCb: React.ChangeEventHandler<HTMLTextAreaElement> =
    useCallback(
      (e) => {
        props.patchCb({
          property: {
            custom: createObject(props.customProps, selector, e.target.value),
          },
        });
      },
      [props, selector]
    );

  return (
    <div>
      <div style={{ color: "white" }}>{props.propName}</div>
      <ControlledInput value={propValue} onChange={callPatchCb} />
    </div>
  );
};
