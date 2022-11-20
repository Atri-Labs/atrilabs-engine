import { useCallback, useState } from "react";
import {
  UploadContainerProps,
  UploadMode,
} from "../components/upload-container/UploadContainer";
import {
  OpenAssetManagerCallabck,
  UseUploadAssetManagerOptions,
} from "../types";
import { createObject } from "@atrilabs/canvas-runtime-utils/src/utils";

export const useUploadAssetManager = ({
  patchCb,
  wrapInUrl,
}: UseUploadAssetManagerOptions) => {
  const [showAssetPanel, setShowAssetPanel] = useState<boolean>(false);
  const [modes, setModes] = useState<UploadMode[]>([]);
  const [linkAssetToSelector, setLinkAssetToSelector] = useState<
    (string | number)[] | null
  >(null);
  const [appendToArray, setAppendToArray] =
    useState<Parameters<OpenAssetManagerCallabck>["3"]>();
  const [referenceObject, setReferenceObject] = useState<
    Parameters<OpenAssetManagerCallabck>["2"]
  >({});

  const callPatchCbWithUrl = useCallback(
    (selector: (string | number)[], url: string) => {
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
        console.log("useUploadAssetManager callPatchCbWithUrl 2", copyArray);
        patchCb(createObject(referenceObject, selector, copyArray));
      } else {
        patchCb(createObject(referenceObject, selector, value));
      }
    },
    [appendToArray, patchCb, referenceObject, wrapInUrl]
  );

  const onCrossClicked = useCallback(() => {
    setShowAssetPanel(false);
    setModes([]);
    setLinkAssetToSelector(null);
  }, []);

  const openAssetManager = useCallback<OpenAssetManagerCallabck>(
    (modes, selector, props, appendToArray) => {
      setReferenceObject(props);
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
