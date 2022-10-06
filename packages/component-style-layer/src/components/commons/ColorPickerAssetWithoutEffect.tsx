import React, { useEffect } from "react";
import { CssProprtyComponentType } from "../../types";
import { ColorPicker, useColor, toColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
import { Cross } from "../../icons/Cross";
import { h5Heading } from "@atrilabs/design-system";

export type ColorPickerProps = {
  closePalette: () => void;
  patchCb: CssProprtyComponentType["patchCb"];
  styles: CssProprtyComponentType["styles"];
  title: string;
  colorValues: [string];
  colorValSetter: (color: string, index: number) => void;
  index: number;
};

export type Color = {
  hex: string;
  rgb: ColorRGB;
  hsv: ColorHSV;
};

type ColorRGB = {
  r: number;
  g: number;
  b: number;
  a: number | undefined;
};

type ColorHSV = {
  h: number;
  s: number;
  v: number;
  a: number | undefined;
};

export const ColorPickerAssetWithoutEffect: React.FC<ColorPickerProps> = (
  props
) => {
  //Internal state is being used to record the last color dragged to in the palette.
  const [color, setColor] = useColor(
    "hex",
    props.colorValues[props.index] || ""
  );

  useEffect(() => {
    setColor(toColor("hex", props.colorValues[props.index] || ""));
  }, [props.colorValues, props.index, props.styles, setColor]);

  const handleChange = (color: string) => {
    props.colorValSetter(color, props.index);
  };

  return (
    <div
      style={{
        backgroundColor: "#374151",
        padding: "10px",
        borderRadius: "8px",
      }}
    >
      <div
        onClick={() => {
          props.closePalette();
        }}
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            ...h5Heading,
            color: "white",
            marginTop: "5px",
            fontSize: "12px",
            marginLeft: "5px",
          }}
        >
          {props.title}
        </span>
        <Cross />
      </div>
      <ColorPicker
        width={250}
        height={200}
        color={color}
        onChange={(e) => handleChange(e.hex)}
        onChangeComplete={(e) => handleChange(e.hex)}
        hideHSV
        dark
      />
    </div>
  );
};
