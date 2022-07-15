import { api } from "@atrilabs/core";
import { useCallback, useEffect, useState } from "react";

export type FormattedAssetsInfo = {
  images: { name: string; url: string; mime: string }[];
  video: { name: string; url: string; mime: string }[];
  audio: { name: string; url: string; mime: string }[];
};

export const useGetAssetsInfo = () => {
  const [assetsInfo, setAssetsInfo] = useState<FormattedAssetsInfo>({
    images: [],
    video: [],
    audio: [],
  });

  const getAssetsInfo = useCallback(() => {
    api.getAssetsInfo((assets) => {
      const assetsInfo: FormattedAssetsInfo = {
        images: [],
        video: [],
        audio: [],
      };
      Object.keys(assets).forEach((key) => {
        if (assets[key].mime.includes("image")) {
          assetsInfo["images"].push({
            name: key,
            url: assets[key].url,
            mime: assets[key].mime,
          });
        } else if (assets[key].mime.includes("audio")) {
          assetsInfo["audio"].push({
            name: key,
            url: assets[key].url,
            mime: assets[key].mime,
          });
        } else if (assets[key].mime.includes("video")) {
          assetsInfo["video"].push({
            name: key,
            url: assets[key].url,
            mime: assets[key].mime,
          });
        }
      });
      setAssetsInfo(assetsInfo);
    });
  }, []);

  useEffect(() => {
    getAssetsInfo();
  }, [getAssetsInfo]);
  return { assetsInfo, getAssetsInfo };
};
