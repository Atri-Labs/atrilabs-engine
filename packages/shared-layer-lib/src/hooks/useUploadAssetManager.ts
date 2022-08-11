import { useCallback, useState } from "react";
import {
  UploadContainerProps,
  UploadMode,
} from "../components/upload-container/UploadContainer";
import {
  OpenAssetManagerCallabck,
  UseUploadAssetManagerOptions,
} from "../types";

export const useUploadAssetManager = ({
  patchCb,
  wrapInUrl,
}: UseUploadAssetManagerOptions) => {
  const [showAssetPanel, setShowAssetPanel] = useState<boolean>(false);
  const [modes, setModes] = useState<UploadMode[]>([]);
  const [linkAssetToSelector, setLinkAssetToSelector] = useState<
    string[] | null
  >(null);
  const [appendToArray, setAppendToArray] =
    useState<Parameters<OpenAssetManagerCallabck>["2"]>();

  const callPatchCbWithUrl = useCallback(
    (selector: string[], url: string) => {
      const obj: any = {};
      let curr = obj;
      for (let i = 0; i < selector.length; i++) {
        const key = selector[i];
        if (i === selector.length - 1) {
          const value = wrapInUrl ? `url("${url}")` : url;
          if (appendToArray) {
            const copyArray = [...appendToArray.currentArray];
            if (
              appendToArray.index >= 0 &&
              appendToArray.index < copyArray.length
            ) {
              copyArray.splice(appendToArray.index, 1, value);
            } else if (appendToArray.index < 0) {
              copyArray.push(value);
            }
            curr[key] = copyArray;
          } else {
            curr[key] = value;
          }
        } else {
          curr[key] = {};
        }
        curr = curr[key];
      }
      patchCb(obj);
    },
    [patchCb, wrapInUrl, appendToArray]
  );

  const onCrossClicked = useCallback(() => {
    setShowAssetPanel(false);
    setModes([]);
    setLinkAssetToSelector(null);
  }, []);

  const openAssetManager = useCallback<OpenAssetManagerCallabck>(
    (modes, selector, appendToArray) => {
      setShowAssetPanel(true);
      setModes(modes);
      setLinkAssetToSelector(selector);
      setAppendToArray(appendToArray);
    },
    []
  );

  const onUploadSuccess = useCallback<
    Required<UploadContainerProps>["onUploadSuccess"]
  >(
    (url) => {
      if (linkAssetToSelector) {
        callPatchCbWithUrl(linkAssetToSelector, url);
      }
      onCrossClicked();
    },
    [callPatchCbWithUrl, linkAssetToSelector, onCrossClicked]
  );

  const onSelect = useCallback<
    Required<UploadContainerProps>["onUploadSuccess"]
  >(
    (url) => {
      if (linkAssetToSelector) {
        callPatchCbWithUrl(linkAssetToSelector, url);
      }
      onCrossClicked();
    },
    [callPatchCbWithUrl, linkAssetToSelector, onCrossClicked]
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
