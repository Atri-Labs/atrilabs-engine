import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";
import { ReactComponent as AddIcon } from "../../assets/add.svg";
import { ReactComponent as MinusIcon } from "../../assets/minus.svg";
import { gray300 } from "@atrilabs/design-system";

export const BooleanList: React.FC<ComponentProps> = (props) => {
  const propValue = useMemo(() => {
    return props.customProps[props.propName];
  }, [props]);
  const insertValueCb = useCallback(() => {
    props.patchCb({
      property: {
        custom: {
          [props.propName]: [...propValue, false],
        },
      },
    });
  }, [props, propValue]);
  const editValueCb = useCallback(
    (index: number) => {
      const oldValue = propValue[index];
      const updatedValue = [...propValue];
      updatedValue.splice(index, 1, !oldValue);
      props.patchCb({
        property: {
          custom: {
            [props.propName]: updatedValue,
          },
        },
      });
    },
    [props, propValue]
  );
  const deleteValueCb = useCallback(
    (index: number) => {
      const updatedValue = [...propValue];
      updatedValue.splice(index, 1);
      props.patchCb({
        property: {
          custom: {
            [props.propName]: updatedValue,
          },
        },
      });
    },
    [props, propValue]
  );
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ color: "white" }}>{props.propName}</div>
        <div onClick={insertValueCb}>
          <AddIcon />
        </div>
      </div>
      {Array.isArray(propValue)
        ? propValue.map((value, index) => {
            return (
              <div
                key={index}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div
                  onClick={() => {
                    editValueCb(index);
                  }}
                  style={{ flexGrow: 1, background: gray300 }}
                >
                  {value.toString()}
                </div>
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
  );
};
