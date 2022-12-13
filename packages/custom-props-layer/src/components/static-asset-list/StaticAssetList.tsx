import { AssetInputButton } from "@atrilabs/shared-layer-lib";
import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";
import { createObject } from "@atrilabs/canvas-runtime-utils/src/utils";
import { ArrayLabel } from "../commons/ArrayLabel";
import { ArrayPropertyContainer } from "../commons/ArrayPropertyContainer";
import { RearrangeListWrapper } from "../commons/RearrangeListWrapper";

export const StaticAssetList: React.FC<ComponentProps> = (props) => {
  const selector = useMemo(() => {
    return props.selector || [];
  }, [props]);

  const srcs = useMemo(() => {
    let currentValue = props.customProps;
    for (let prop of selector) {
      currentValue = currentValue[prop];
      if (currentValue === undefined) break;
    }
    return (currentValue || []) as string[];
  }, [props.customProps, selector]);

  const onClick = useCallback(
    (index: number) => {
      props.openAssetManager(
        ["select", "upload"],
        ["property", "custom", ...selector],
        { property: { custom: props.customProps } },
        {
          currentArray: srcs || [],
          index,
        }
      );
    },
    [props, selector, srcs]
  );

  const onClearClick = useCallback(
    (index: number) => {
      const previousSrcs = [...srcs];
      previousSrcs.splice(index, 1);
      props.patchCb({
        property: {
          custom: createObject(props.customProps, selector, previousSrcs),
        },
      });
    },
    [props, selector, srcs]
  );

  const onInsertClick = useCallback(() => {
    const previousSrcs = [...srcs];
    props.patchCb({
      property: {
        custom: createObject(props.customProps, selector, [
          ...previousSrcs,
          "",
        ]),
      },
    });
  }, [props, selector, srcs]);

  const onReposition = useCallback(
    (deleteAt: number, insertAt: number) => {
      const updatedValue = [...srcs];
      const deletedItem = updatedValue.splice(deleteAt, 1)[0];
      updatedValue.splice(insertAt, 0, deletedItem);
      props.patchCb({
        property: {
          custom: createObject(props.customProps, selector, updatedValue),
        },
      });
    },
    [srcs, props, selector]
  );

  return (
    <ArrayPropertyContainer>
      <ArrayLabel onAddClick={onInsertClick} name={props.propName} />
      <RearrangeListWrapper
        onReposition={onReposition}
        onMinusClick={onClearClick}
        minusButton={true}
      >
        {srcs.map((value, index) => {
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
              <AssetInputButton
                assetName={value || "Select Image"}
                onClick={() => {
                  onClick(index);
                }}
                onClearClick={() => {
                  onClearClick(index);
                }}
                hideClear={true}
              />
            </div>
          );
        })}
      </RearrangeListWrapper>
    </ArrayPropertyContainer>
  );
};
