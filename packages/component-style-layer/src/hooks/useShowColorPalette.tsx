import { useState, useCallback } from "react";
import { CssProprtyComponentType } from "../types";

export const useShowColorPalette = () => {
  const [showColorPalette, setShowColorPalette] = useState<boolean>(false);
  const [actionFlag, setActionFlag] = useState<boolean>(true);
  const [colorVal, setColorVal] = useState("");
  const [title, setTitle] = useState<string>("Property");
  const [linkColorPaletteToStyleItem, setLinkColorPaletteToStyleItem] =
    useState<keyof React.CSSProperties | null>(null);

  const openPalette = useCallback<CssProprtyComponentType["openPalette"]>(
    (styleItem, name, actionFlag) => {
      setLinkColorPaletteToStyleItem(styleItem);
      setTitle(name);
      setActionFlag(actionFlag);
      setShowColorPalette(true);
    },
    []
  );
  const closePalette = useCallback(() => {
    setLinkColorPaletteToStyleItem(null);
    setShowColorPalette(false);
  }, []);

  const colorValSetter = (color: string) => {
    setColorVal(color);
  };

  return {
    showColorPalette,
    linkColorPaletteToStyleItem,
    title,
    actionFlag,
    colorVal,
    colorValSetter,
    openPalette,
    closePalette,
  };
};
