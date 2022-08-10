import { AssetInputButton } from "@atrilabs/shared-layer-lib";
import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";
import { ReactComponent as AddIcon } from "../../assets/add.svg";

export const StaticAssetList: React.FC<ComponentProps> = (props) => {
  const srcs = useMemo(() => {
    console.log(props.customProps[props.propName]);
    return (props.customProps[props.propName] || []) as string[];
  }, [props.customProps, props.propName]);
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
      const previousSrcs = srcs;
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
    const previousSrcs = srcs;
    props.patchCb({
      property: {
        custom: {
          [props.propName]: [...previousSrcs, ""],
        },
      },
    });
  }, [props, srcs]);

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
      {srcs.map((value, index) => {
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
