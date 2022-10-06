import { UploadMode } from "@atrilabs/shared-layer-lib";
import React from "react";

export type CssProprtyComponentType = {
  compId: string;
  styles: React.CSSProperties;
  patchCb: (slice: any) => void;
  openAssetManager: (
    modes: UploadMode[],
    styleItem: keyof React.CSSProperties
  ) => void;
  openPalette: (styleItem: keyof React.CSSProperties, name: string) => void;
  openPaletteWithoutEffect: (name: string, index: number) => void;
  colorValue: [string];
  setColorValue: (color: string, index: number) => void;
  colorValueArraySetter: (colorValues: [string]) => void;
};
