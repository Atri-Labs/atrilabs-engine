import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";
import { ReactComponent as MinusIcon } from "../../assets/minus.svg";
import { ArrayLabel } from "../commons/ArrayLabel";
import { ArrayPropertyContainer } from "../commons/ArrayPropertyContainer";
import { gray900 } from "@atrilabs/design-system";

export const EnumList: React.FC<ComponentProps> = (props) => {
  const propValue = useMemo(() => {
    return props.customProps[props.propName] || [];
  }, [props]);
  const insertValueCb = useCallback(() => {
    props.patchCb({
      property: {
        custom: {
          [props.propName]: [...propValue, ""],
        },
      },
    });
  }, [props, propValue]);
  const editValueCb = useCallback(
    (index: number, value: string) => {
      const updatedValue = [...propValue];
      updatedValue.splice(index, 1, value);
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
    <ArrayPropertyContainer>
      <ArrayLabel onAddClick={insertValueCb} name={props.propName} />

      {Array.isArray(propValue)
        ? propValue.map((value, index) => {
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  columnGap: "1em",
                  marginBottom: "0.5em",
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
    </ArrayPropertyContainer>
  );
};
