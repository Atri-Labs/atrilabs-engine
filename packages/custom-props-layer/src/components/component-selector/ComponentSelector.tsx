import { useCallback, useMemo } from "react";
import { useManualHover } from "../../hooks/useManualHover";
import { ComponentProps } from "../../types";

export const ComponentSelector: React.FC<ComponentProps> = (props) => {
  const propValue = useMemo(() => {
    return props.customProps[props.propName];
  }, [props]);
  const callPatchCb = useCallback(
    (alias: string) => {
      props.patchCb({
        property: {
          custom: {
            [props.propName]: alias,
          },
        },
      });
    },
    [props]
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
