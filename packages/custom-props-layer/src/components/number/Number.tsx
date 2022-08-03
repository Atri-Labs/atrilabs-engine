import { ComponentProps } from "../../types";
import { useMemo, useCallback } from "react";
export const Number: React.FC<ComponentProps> = (props) => {
  const propValue = useMemo(() => {
    return props.customProps[props.propName];
  }, [props]);
  const callPatchCb = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      props.patchCb({
        property: {
          custom: {
            [props.propName]: e.target.value ? parseFloat(e.target.value) : "",
          },
        },
      });
    },
    [props]
  );
  return (
    <div>
      <div style={{ color: "white" }}>{props.propName}</div>
      <input value={propValue} onChange={callPatchCb} type={"number"} />
    </div>
  );
};
