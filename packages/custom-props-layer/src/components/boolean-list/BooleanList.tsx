import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";
import { ArrayLabel } from "../commons/ArrayLabel";
import { ArrayPropertyContainer } from "../commons/ArrayPropertyContainer";
import { Checkbox } from "../commons/Checkbox";
import { RearrangeListWrapper } from "../commons/RearrangeListWrapper";

export const BooleanList: React.FC<ComponentProps> = (props) => {
  const propValue = useMemo(() => {
    return props.customProps[props.propName] || [];
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
  const onReposition = useCallback(
    (deleteAt: number, insertAt: number) => {
      const updatedValue = [...propValue];
      const deletedItem = updatedValue.splice(deleteAt, 1)[0];
      updatedValue.splice(insertAt, 0, deletedItem);
      props.patchCb({
        property: {
          custom: {
            [props.propName]: updatedValue,
          },
        },
      });
    },
    [propValue, props]
  );
  return (
    <ArrayPropertyContainer>
      <ArrayLabel onAddClick={insertValueCb} name={props.propName} />
      {Array.isArray(propValue) ? (
        <RearrangeListWrapper
          onReposition={onReposition}
          onMinusClick={deleteValueCb}
        >
          {propValue.map((value, index) => {
            return (
              <div
                key={index}
                style={{
                  width: "calc(100% - 1.5rem)",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  key={index}
                  onChange={() => {
                    editValueCb(index);
                  }}
                  value={value}
                />
              </div>
            );
          })}
        </RearrangeListWrapper>
      ) : null}
    </ArrayPropertyContainer>
  );
};
