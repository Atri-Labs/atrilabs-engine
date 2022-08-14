import { AssetInputButton } from "@atrilabs/shared-layer-lib";
import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";
import { ArrayLabel } from "../commons/ArrayLabel";
import { ArrayPropertyContainer } from "../commons/ArrayPropertyContainer";
import { RearrangeListWrapper } from "../commons/RearrangeListWrapper";

export const StaticAssetList: React.FC<ComponentProps> = (props) => {
  const srcs = useMemo(() => {
    return (props.customProps[props.propName] || []) as string[];
  }, [props.customProps, props.propName]);
  const onClick = useCallback(
    (index: number) => {
      props.openAssetManager(
        ["select", "upload"],
        ["property", "custom", props.propName],
        { currentArray: props.customProps[props.propName] || [], index }
      );
    },
    [props]
  );

  const onClearClick = useCallback(
    (index: number) => {
      console.log("onclear called");
      const previousSrcs = [...srcs];
      previousSrcs.splice(index, 1);
      props.patchCb({
        property: {
          custom: {
            [props.propName]: previousSrcs,
          },
        },
      });
    },
    [props, srcs]
  );

  const onInsertClick = useCallback(() => {
    const previousSrcs = [...srcs];
    props.patchCb({
      property: {
        custom: {
          [props.propName]: [...previousSrcs, ""],
        },
      },
    });
  }, [props, srcs]);

  const onReposition = useCallback(
    (deleteAt: number, insertAt: number) => {
      const updatedValue = [...srcs];
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
    [srcs, props]
  );

  return (
    <ArrayPropertyContainer>
      <ArrayLabel onAddClick={onInsertClick} name={props.propName} />
      <RearrangeListWrapper
        onReposition={onReposition}
        onMinusClick={onClearClick}
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
