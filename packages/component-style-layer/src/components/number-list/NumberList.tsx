import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";
import { ReactComponent as MinusIcon } from "../../assets/minus.svg";
import { ArrayLabel } from "../commons/ArrayLabel";
import { ArrayPropertyContainer } from "../commons/ArrayPropertyContainer";

export const NumberList: React.FC<ComponentProps> = (props) => {
  const insertValueCb = useCallback(() => {
    props.updateValueCb(props.values.concat(0));
  }, [props]);

  const editValueCb = useCallback(
    (index: number, value: string) => {
      const updatedValue = [...props.values];
      updatedValue.splice(index, 1, parseFloat(value) || 0);
      props.updateValueCb(updatedValue);
    },
    [props]
  );

  const deleteValueCb = useCallback(
    (index: number) => {
      const updatedValue = [...props.values];
      updatedValue.splice(index, 1);
      props.updateValueCb(updatedValue);
    },
    [props]
  );

  return (
    <ArrayPropertyContainer>
      {props.name && (
        <ArrayLabel onAddClick={insertValueCb} name={props.name} />
      )}
      {Array.isArray(props.values)
        ? props.values.map((value, index) => {
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
