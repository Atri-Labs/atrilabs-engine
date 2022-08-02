import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";

export const Boolean: React.FC<ComponentProps> = (props) => {
  const propValue = useMemo(() => {
    return props.customProps[props.propName];
  }, [props]);
  const callPatchCb = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      props.patchCb({
        property: {
          custom: {
            [props.propName]: e.target.checked,
          },
        },
      });
    },
    [props]
  );
  return (
    <div>
      <div style={{ color: "white" }}>{props.propName}</div>
      <input onChange={callPatchCb} type="checkbox" checked={propValue} />
    </div>
  );
};
