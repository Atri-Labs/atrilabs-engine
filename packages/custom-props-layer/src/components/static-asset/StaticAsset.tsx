import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";
import { AssetInputButton } from "@atrilabs/shared-layer-lib";

export const StaticAsset: React.FC<ComponentProps> = (props) => {
  const propValue = useMemo(() => {
    return props.customProps[props.propName] || "Select Image";
  }, [props]);
  const onClick = useCallback(() => {
    props.openAssetManager(
      ["select", "upload"],
      ["property", "custom", props.propName]
    );
  }, [props]);
  const onClearClick = useCallback(() => {
    props.patchCb({
      property: {
        custom: {
          [props.propName]: "",
        },
      },
    });
  }, [props]);
  return (
    <div>
      <div style={{ color: "white" }}>{props.propName}</div>
      <AssetInputButton
        assetName={propValue}
        onClick={onClick}
        onClearClick={onClearClick}
      />
    </div>
  );
};
