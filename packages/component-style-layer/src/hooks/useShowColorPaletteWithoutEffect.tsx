import { useState, useCallback } from "react";
import { CssProprtyComponentType } from "../types";
export type useShowColorPaletteWithoutEffectProps = {
  name: string;
  index: number;
};
export const useShowColorPaletteWithoutEffect = () => {
  const [showColorPaletteWithoutEffect, setShowColorPaletteWithoutEffect] =
    useState<boolean>(false);
  const [colorVal, setColorVal] = useState<[string]>(["#ffffff"]);
  const [titleWithoutEffect, setTitleWithoutEffect] =
    useState<string>("Property");
  const [linkColorPaletteToIndex, setLinkColorPaletteToIndex] =
    useState<number>(0);

  const openPaletteWithoutEffect = useCallback<
    CssProprtyComponentType["openPaletteWithoutEffect"]
  >((name, index) => {
    setLinkColorPaletteToIndex(index);
    setTitleWithoutEffect(name);
    setShowColorPaletteWithoutEffect(true);
  }, []);
  const closePaletteWithoutEffect = useCallback(() => {
    setLinkColorPaletteToIndex(0);
    setShowColorPaletteWithoutEffect(false);
  }, []);

  const colorValSetter = (color: string, index: number) => {
    console.log("colorwe hook", color);
    const arr = colorVal;
    if (arr) {
      arr[index] = color;
    }
    console.log(arr);
    setColorVal(arr);
  };

  const colorValueArraySetter = (colorValues: [string]) => {
    setColorVal(colorValues);
  };

  return {
    showColorPaletteWithoutEffect,
    titleWithoutEffect,
    linkColorPaletteToIndex,
    colorVal,
    colorValSetter,
    colorValueArraySetter,
    openPaletteWithoutEffect,
    closePaletteWithoutEffect,
  };
};
