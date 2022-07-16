import React from "react";

export type CssProprtyComponentType = {
  styles: React.CSSProperties;
  patchCb: (slice: any) => void;
  openAssetManager: (
    mode: ("upload" | "upload_multiple" | "select")[],
    styleItem: string
  ) => void;
};
