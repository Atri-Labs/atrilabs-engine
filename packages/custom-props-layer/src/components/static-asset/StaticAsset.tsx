import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";
import { AssetInputButton } from "@atrilabs/shared-layer-lib";
import { PropertyContainer } from "../commons/PropertyContainer";
import { Label } from "../commons/Label";

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
    <PropertyContainer>
      <Label name={props.propName} />
      <AssetInputButton
        assetName={propValue}
        onClick={onClick}
        onClearClick={onClearClick}
      />
    </PropertyContainer>
  );
};
