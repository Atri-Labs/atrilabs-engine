import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";
import { ReactComponent as MinusIcon } from "../../assets/minus.svg";
import { ArrayLabel } from "../commons/ArrayLabel";
import { ArrayPropertyContainer } from "../commons/ArrayPropertyContainer";
import { gray900 } from "@atrilabs/design-system";
import { createObject } from "@atrilabs/canvas-runtime-utils/src/utils";

export const EnumList: React.FC<ComponentProps> = (props) => {
  const selector = useMemo(() => {
    return props.selector || [];
  }, [props]);

  const propValue = useMemo(() => {
    let currentValue = props.customProps;
    for (let prop of selector) {
      currentValue = currentValue[prop];
      if (currentValue === undefined) break;
    }
    return currentValue || [];
  }, [props, selector]);

  const insertValueCb = useCallback(() => {
    props.patchCb({
      property: {
        custom: createObject(props.customProps, selector, propValue.concat("")),
      },
    });
  }, [props, selector, propValue]);

  const editValueCb = useCallback(
    (index: number, value: string) => {
      const updatedValue = [...propValue];
      updatedValue.splice(index, 1, value);
      props.patchCb({
        property: {
          custom: createObject(props.customProps, selector, updatedValue),
        },
      });
    },
    [propValue, props, selector]
  );

  const deleteValueCb = useCallback(
    (index: number) => {
      const updatedValue = [...propValue];
      updatedValue.splice(index, 1);
      props.patchCb({
        property: {
          custom: createObject(props.customProps, selector, updatedValue),
        },
      });
    },
    [propValue, props, selector]
  );

  return (
    <ArrayPropertyContainer>
      <ArrayLabel onAddClick={insertValueCb} name={props.propName} />
      <div
        style={{ display: "flex", flexDirection: "column", rowGap: "0.5em" }}
      >
        {Array.isArray(propValue)
          ? propValue.map((value, index) => {
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    columnGap: "1em",
                  }}
                >
                  <select
                    value={value}
                    onChange={(e) => {
                      editValueCb(index, e.target.value);
                    }}
                    style={{
                      height: "25px",
                      backgroundColor: gray900,
                      border: "none",
                      outline: "none",
                      color: "white",
                      padding: "0 4px",
                      minWidth: "none",
                      width: "100%",
                    }}
                  >
                    {props.options!.map((option: string, index: number) => (
                      <option value={option} key={index}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div
                    style={{ display: "flex", alignItems: "center" }}
                    onClick={() => {
                      deleteValueCb(index);
                    }}
                  >
                    <MinusIcon />
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </ArrayPropertyContainer>
  );
};
