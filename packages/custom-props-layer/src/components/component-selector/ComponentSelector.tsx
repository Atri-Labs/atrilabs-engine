import { useCallback, useMemo } from "react";
import { useManualHover } from "../../hooks/useManualHover";
import { ComponentProps } from "../../types";
import { createObject } from "@atrilabs/canvas-runtime-utils/src/utils";

export const ComponentSelector: React.FC<ComponentProps> = (props) => {
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
    (alias: string) => {
      props.patchCb({
        property: {
          custom: createObject(props.customProps, selector, alias),
        },
      });
    },
    [props, selector]
  );

  const { hoverManually, getComponents } = useManualHover();

  return (
    <div>
      <div style={{ color: "white" }}>{props.propName}</div>
      <div style={{ backgroundColor: "white", color: "black" }}>
        <div>{propValue ? propValue : " "}</div>
        <div>
          {getComponents().map(({ compId, alias }) => {
            return (
              <div
                key={compId}
                onMouseEnter={() => {
                  console.log("mouse entered");
                  hoverManually(compId);
                }}
                onClick={() => {
                  callPatchCb(compId);
                }}
              >
                {alias}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
