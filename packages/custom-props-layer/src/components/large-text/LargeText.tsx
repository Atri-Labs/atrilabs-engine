import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";
import ControlledInput from "./ControlledInput";
import { createObject } from "../../utility/Utility";

export const LargeText: React.FC<ComponentProps> = (props) => {
  const selector = useMemo(() => {
    return props.selector || [];
  }, [props]);
  const propValue = useMemo(() => {
    let currentValue = props.customProps;
    for (let prop of selector) {
      currentValue = currentValue[prop];
    }
    return currentValue || "";
  }, [props, selector]);
  const callPatchCb: React.ChangeEventHandler<HTMLTextAreaElement> =
    useCallback(
      (e) => {
        props.patchCb({
          property: {
            custom: createObject(selector, e.target.value),
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
