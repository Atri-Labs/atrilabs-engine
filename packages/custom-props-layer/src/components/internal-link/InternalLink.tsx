import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";

export const InternalLink: React.FC<ComponentProps> = (props) => {
  const propValue: string = useMemo(() => {
    return props.customProps[props.propName] || "";
  }, [props]);
  const callPatchCb = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
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
      <select value={propValue} onChange={callPatchCb}>
        <option value={propValue}>{propValue}</option>
        {props.routes.map((value) => {
          return (
            <option value={value} key={value}>
              {value}
            </option>
          );
        })}
      </select>
    </div>
  );
};
