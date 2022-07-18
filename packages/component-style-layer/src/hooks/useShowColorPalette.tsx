import { useState, useCallback } from "react";
import { CssProprtyComponentType } from "../types";

export const useShowColorPalette = () => {
  const [showColorPalette, setShowColorPalette] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("Property");
  const [linkColorPaletteToStyleItem, setLinkColorPaletteToStyleItem] =
    useState<keyof React.CSSProperties | null>(null);

  const openPalette = useCallback<CssProprtyComponentType["openPalette"]>(
    (styleItem, name) => {
      setLinkColorPaletteToStyleItem(styleItem);
      setTitle(name);
      setShowColorPalette(true);
    },
    []
  );
  const closePalette = useCallback(() => {
    setLinkColorPaletteToStyleItem(null);
    setShowColorPalette(false);
  }, []);

  return {
    showColorPalette,
    linkColorPaletteToStyleItem,
    title,
    openPalette,
    closePalette,
  };
};
