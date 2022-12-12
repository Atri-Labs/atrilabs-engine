import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";
import { createObject } from "@atrilabs/canvas-runtime-utils/src/utils";
import { ArrayLabel } from "../commons/ArrayLabel";
import { ArrayPropertyContainer } from "../commons/ArrayPropertyContainer";
import { Checkbox } from "../commons/Checkbox";
import { RearrangeListWrapper } from "../commons/RearrangeListWrapper";

export const BooleanList: React.FC<ComponentProps> = (props) => {
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
        custom: createObject(
          props.customProps,
          selector,
          propValue.concat(false)
        ),
      },
    });
  }, [props, propValue, selector]);

  const editValueCb = useCallback(
    (index: number) => {
      const oldValue = propValue[index];
      const updatedValue = [...propValue];
      updatedValue.splice(index, 1, !oldValue);
      props.patchCb({
        property: {
          custom: createObject(props.customProps, selector, updatedValue),
        },
      });
    },
    [props, propValue, selector]
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
    [props, propValue, selector]
  );

  const onReposition = useCallback(
    (deleteAt: number, insertAt: number) => {
      const updatedValue = [...propValue];
      const deletedItem = updatedValue.splice(deleteAt, 1)[0];
      updatedValue.splice(insertAt, 0, deletedItem);
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
      {Array.isArray(propValue) ? (
        <RearrangeListWrapper
          onReposition={onReposition}
          onMinusClick={deleteValueCb}
          minusButton={true}
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
