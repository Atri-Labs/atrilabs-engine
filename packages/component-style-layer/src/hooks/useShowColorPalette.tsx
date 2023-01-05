import { useState, useCallback } from "react";
import { CssProprtyComponentType } from "../types";

export const useShowColorPalette = () => {
  const [showColorPalette, setShowColorPalette] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("Property");
  const [linkColorPaletteToStyleItem, setLinkColorPaletteToStyleItem] =
    useState<keyof React.CSSProperties | null>(null);
  const [linkColorPaletteToChangeColor, setLinkColorPaletteToChangeColor] =
    useState<((color: string, index: number) => void) | undefined>();
  const [linkColorPaletteToCurrentIndex, setLinkColorPaletteToCurrentIndex] =
    useState<number | undefined>();
  const [linkColorPaletteToCurrentColor, setLinkColorPaletteToCurrentColor] =
    useState<string | undefined>();

  const openPalette = useCallback<CssProprtyComponentType["openPalette"]>(
    (styleItem, name, changeColor, index, currentColor) => {
      setLinkColorPaletteToStyleItem(styleItem);
      if (changeColor) {
        setLinkColorPaletteToChangeColor(() => changeColor);
        setLinkColorPaletteToCurrentIndex(index);
        setLinkColorPaletteToCurrentColor(currentColor!);
      }
      setTitle(name);
      setShowColorPalette(true);
    },
    []
  );
  const closePalette = useCallback(() => {
    setLinkColorPaletteToStyleItem(null);
    setLinkColorPaletteToChangeColor(() => undefined);
    setLinkColorPaletteToCurrentIndex(undefined);
    setLinkColorPaletteToCurrentColor(undefined);
    setShowColorPalette(false);
  }, []);

  return {
    showColorPalette,
    linkColorPaletteToStyleItem,
    linkColorPaletteToChangeColor,
    linkColorPaletteToCurrentIndex,
    linkColorPaletteToCurrentColor,
    title,
    openPalette,
    closePalette,
  };
};
