import { useCallback, useMemo } from "react";
import { ComponentProps } from "../../types";
import { AssetInputButton } from "@atrilabs/shared-layer-lib";
import { PropertyContainer } from "../commons/PropertyContainer";
import { Label } from "../commons/Label";
import { createObject } from "@atrilabs/canvas-runtime-utils/src/utils";

export const StaticAsset: React.FC<ComponentProps> = (props) => {
  const selector = useMemo(() => {
    return props.selector || [];
  }, [props]);

  const propValue = useMemo(() => {
    let currentValue = props.customProps;
    for (let prop of selector) {
      currentValue = currentValue[prop];
      if (currentValue === undefined) break;
    }
    return currentValue || "Select Image";
  }, [props, selector]);

  const onClick = useCallback(() => {
    props.openAssetManager(
      ["select", "upload"],
      ["property", "custom", ...selector],
      { property: { custom: props.customProps } }
    );
  }, [props, selector]);

  const onClearClick = useCallback(() => {
    props.patchCb({
      property: {
        custom: createObject(props.customProps, selector, ""),
      },
    });
  }, [props, selector]);

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
