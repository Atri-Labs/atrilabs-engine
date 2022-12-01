import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";
import { ReactComponent as MinusIcon } from "../../assets/minus.svg";
import { ArrayLabel } from "../commons/ArrayLabel";
import { ArrayPropertyContainer } from "../commons/ArrayPropertyContainer";
import { createObject } from "@atrilabs/canvas-runtime-utils/src/utils";

export const NumberList: React.FC<ComponentProps> = (props) => {
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
        custom: createObject(props.customProps, selector, propValue.concat(0)),
      },
    });
  }, [props, selector, propValue]);

  const editValueCb = useCallback(
    (index: number, value: string) => {
      const updatedValue = [...propValue];
      updatedValue.splice(index, 1, parseFloat(value) || "");
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
      {Array.isArray(propValue)
        ? propValue.map((value, index) => {
            return (
              <div
                key={index}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <input
                  value={value}
                  onChange={(e) => {
                    editValueCb(index, e.target.value);
                  }}
                  type="number"
                />
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
    </ArrayPropertyContainer>
  );
};
