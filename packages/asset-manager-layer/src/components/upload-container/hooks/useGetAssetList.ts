import { api } from "@atrilabs/core";
import { useCallback, useEffect, useState } from "react";

export type FormattedAssetInfo = {
  images: { name: string; url: string; mime: string }[];
  video: { name: string; url: string; mime: string }[];
  audio: { name: string; url: string; mime: string }[];
};

export const useGetAssetInfo = () => {
  const [assetsInfo, setAssetsInfo] = useState<FormattedAssetInfo>({
    images: [],
    video: [],
    audio: [],
  });

  const getAssetInfo = useCallback(() => {
    api.getAssetsInfo((assets) => {
      const assetsInfo: FormattedAssetInfo = {
        images: [],
        video: [],
        audio: [],
      };
      Object.keys(assets).forEach((key) => {
        const assetInfo = assets[key];
        if (assetInfo.mime.includes("image")) {
          assetsInfo["images"].push({
            name: key,
            url: assetInfo.url,
            mime: assetInfo.mime,
          });
        } else if (assetInfo.mime.includes("audio")) {
          assetsInfo["audio"].push({
            name: key,
            url: assetInfo.url,
            mime: assetInfo.mime,
          });
        } else if (assetInfo.mime.includes("video")) {
          assetsInfo["video"].push({
            name: key,
            url: assetInfo.url,
            mime: assetInfo.mime,
          });
        }
      });
      setAssetsInfo(assetsInfo);
    });
  }, []);

  useEffect(() => {
    getAssetInfo();
  }, [getAssetInfo]);
  // TODO:
  // convert asset info into categories and sort alphabetically
  // use mime field to categorize the asset
  return { assetsInfo, getAssetInfo };
};
