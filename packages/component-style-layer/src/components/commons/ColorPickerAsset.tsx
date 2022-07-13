import React from "react";
import { CssProprtyComponentType } from "../../types";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";

export type ColorPickerProps = {
  styleItem: keyof React.CSSProperties;
  patchCb: CssProprtyComponentType["patchCb"];
  styles: CssProprtyComponentType["styles"];
};

export const ColorPickerAsset: React.FC<ColorPickerProps> = (props) => {
  //Internal state is being used to record the last color dragged to in the palette.
  const [color, setColor] = useColor("hex", "");

  const handleChange =(
    color: string,
    styleItem: keyof React.CSSProperties
  ) => {
    props.patchCb({
      property: {
        styles: {
          [styleItem]: color,
        },
      },
    });
  };
  return (
    <div>
      <ColorPicker
        width={250}
        height={200}
        color={color}
        onChange={setColor}
        onChangeComplete={(e) => handleChange(e.hex, props.styleItem)}
        hideHSV
        dark
      />
    </div>
  );
};
