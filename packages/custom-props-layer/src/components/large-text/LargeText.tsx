import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";

export const LargeText: React.FC<ComponentProps> = (props) => {
  const propValue = useMemo(() => {
    return props.customProps[props.propName];
  }, [props]);
  const callPatchCb: React.ChangeEventHandler<HTMLTextAreaElement> =
    useCallback(
      (e) => {
        props.patchCb({
          property: {
            custom: {
              [props.propName]: e.target.value,
            },
          },
        });
      },
      [props]
    );
  return (
    <div>
      <div style={{ color: "white" }}>{props.propName}</div>
      <textarea value={propValue} onChange={callPatchCb} rows={5} />
    </div>
  );
};
