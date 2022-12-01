import { ComponentProps } from "../../types";
import { useMemo, useCallback } from "react";
import { createObject } from "@atrilabs/canvas-runtime-utils/src/utils";

export const ExternalLink: React.FC<ComponentProps> = (props) => {
  const selector = useMemo(() => {
    return props.selector || [];
  }, [props]);

  const propValue = useMemo(() => {
    let currentValue = props.customProps;
    for (let prop of selector) {
      currentValue = currentValue[prop];
      if (currentValue === undefined) break;
    }
    return currentValue;
  }, [props, selector]);

  const callPatchCb = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <input value={propValue} onChange={callPatchCb} />
    </div>
  );
};
