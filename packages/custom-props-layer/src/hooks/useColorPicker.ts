import { ColorPickerDialogProps } from "@atrilabs/shared-layer-lib";
import { useCallback, useState } from "react";

export const useColorPicker = () => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerProps, setColorPickerProps] =
    useState<ColorPickerDialogProps>();
  const openColorPicker = useCallback(
    (colorPickerProps: Omit<ColorPickerDialogProps, "onCrossClick">) => {
      console.log("openColorPicker");
      setColorPickerProps({
        ...colorPickerProps,
        onCrossClick: () => {
          setShowColorPicker(false);
        },
      });
      setShowColorPicker(true);
    },
    []
  );
  return { showColorPicker, colorPickerProps, openColorPicker };
};
