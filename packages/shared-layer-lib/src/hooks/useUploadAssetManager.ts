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

  const callPatchCbWithUrl = useCallback(
    (selector: string[], url: string) => {
      const obj: any = {};
      let curr = obj;
      for (let i = 0; i < selector.length; i++) {
        const key = selector[i];
        if (i === selector.length - 1) {
          if (wrapInUrl) curr[key] = `url("${url}")`;
          else curr[key] = url;
        } else {
          curr[key] = {};
        }
        curr = curr[key];
      }
      patchCb(obj);
    },
    [patchCb, wrapInUrl]
  );

  const onCrossClicked = useCallback(() => {
    setShowAssetPanel(false);
    setModes([]);
    setLinkAssetToSelector(null);
  }, []);

  const openAssetManager = useCallback<OpenAssetManagerCallabck>(
    (modes, selector) => {
      setShowAssetPanel(true);
      setModes(modes);
      setLinkAssetToSelector(selector);
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
