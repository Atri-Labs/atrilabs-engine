import { AssetInputButton } from "@atrilabs/shared-layer-lib";
import { useCallback } from "react";
import { ComponentProps } from "../../types";
import { ReactComponent as AddIcon } from "../../assets/add.svg";

export const StaticAssetList: React.FC<ComponentProps> = (props) => {
  const onClick = useCallback(
    (index: number) => {
      props.openAssetManager(
        ["select", "upload"],
        ["property", "custom", props.propName, index.toString()]
      );
    },
    [props]
  );

  const onClearClick = useCallback(
    (index: number) => {
      const previousSrcs = props.customProps[props.propName] as string[];
      previousSrcs.splice(index, 1);
      props.patchCb({
        property: {
          custom: {
            [props.propName]: previousSrcs,
          },
        },
      });
    },
    [props]
  );

  const onInsertClick = useCallback(() => {
    const previousSrcs = props.customProps[props.propName] as string[];
    props.patchCb({
      property: {
        custom: {
          [props.propName]: [...previousSrcs, ""],
        },
      },
    });
  }, [props]);

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
        <div onClick={onInsertClick}>
          <AddIcon />
        </div>
      </div>
      <div style={{ color: "white" }}>{props.propName}</div>
      {(props.customProps[props.propName] as string[]).map((value, index) => {
        return (
          <AssetInputButton
            assetName={value || "Select Image"}
            onClick={() => {
              onClick(index);
            }}
            onClearClick={() => {
              onClearClick(index);
            }}
          />
        );
      })}
    </div>
  );
};
