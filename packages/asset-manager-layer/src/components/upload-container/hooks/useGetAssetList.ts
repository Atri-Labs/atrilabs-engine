import { api } from "@atrilabs/core";
import { useCallback, useEffect, useState } from "react";

export const useGetAssetInfo = () => {
  const [assetInfo, setAssetInfo] = useState<{
    [name: string]: {
      url: string;
      mime: string;
    };
  }>({});
  const getAssetInfo = useCallback(() => {
    api.getAssetsInfo((assets) => {
      setAssetInfo(assets);
    });
  }, []);
  useEffect(() => {
    getAssetInfo();
  }, [getAssetInfo]);
  // TODO:
  // convert asset info into categories and sort alphabetically
  // use mime field to categorize the asset
  return { assetInfo, getAssetInfo };
};
