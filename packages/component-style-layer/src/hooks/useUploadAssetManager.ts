import { UploadMode } from "@atrilabs/shared-layer-lib";
import { UploadContainerProps } from "@atrilabs/shared-layer-lib";
import React, { useCallback, useState } from "react";
import { CssProprtyComponentType } from "../types";

export const useUploadAssetManager = (
  patchCb: CssProprtyComponentType["patchCb"]
) => {
  const [showAssetPanel, setShowAssetPanel] = useState<boolean>(false);
  const [modes, setModes] = useState<UploadMode[]>([]);
  const [linkAssetToStyleItem, setLinkAssetToStyleItem] = useState<
    keyof React.CSSProperties | null
  >(null);

  const [linkAssetToStyleValue, setLinkAssetToStyleValue] = useState<
    string | null
  >(null);

  const callPatchCbWithUrl = useCallback(
    (styleItem: keyof React.CSSProperties, url: string) => {
      patchCb({
        property: {
          styles: {
            [styleItem]: linkAssetToStyleValue?.toString()?.includes("url")
              ? `${linkAssetToStyleValue}url("${url}")`
              : `url("${url}")`,
          },
        },
      });
    },
    [patchCb, linkAssetToStyleValue, linkAssetToStyleItem]
  );

  const onCrossClicked = useCallback(() => {
    setModes([]);
    setShowAssetPanel(false);
    setLinkAssetToStyleItem(null);
  }, []);

  const openAssetManager = useCallback<
    CssProprtyComponentType["openAssetManager"]
  >((modes, styleItem, styleValue) => {
    setShowAssetPanel(true);
    setModes(modes);
    setLinkAssetToStyleItem(styleItem);
    setLinkAssetToStyleValue(styleValue);
  }, []);

  const onUploadSuccess = useCallback<
    Required<UploadContainerProps>["onUploadSuccess"]
  >(
    (url) => {
      if (linkAssetToStyleItem) {
        callPatchCbWithUrl(linkAssetToStyleItem, url);
      }
      onCrossClicked();
    },
    [callPatchCbWithUrl, linkAssetToStyleItem, onCrossClicked]
  );

  const onSelect = useCallback<
    Required<UploadContainerProps>["onUploadSuccess"]
  >(
    (url) => {
      if (linkAssetToStyleItem) {
        callPatchCbWithUrl(linkAssetToStyleItem, url);
      }
      onCrossClicked();
    },
    [callPatchCbWithUrl, linkAssetToStyleItem, onCrossClicked]
  );

  return {
    showAssetPanel,
    modes,
    onUploadSuccess,
    onSelect,
    onCrossClicked,
    openAssetManager,
  };
};
