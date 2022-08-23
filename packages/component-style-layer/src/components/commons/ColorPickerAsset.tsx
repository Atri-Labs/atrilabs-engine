import React, { useEffect } from "react";
import { CssProprtyComponentType } from "../../types";
import { ColorPicker, useColor, toColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
import { Cross } from "../../icons/Cross";
import { h5Heading } from "@atrilabs/design-system";

export type ColorPickerProps = {
  styleItem: keyof React.CSSProperties;
  closePalette: () => void;
  patchCb: CssProprtyComponentType["patchCb"];
  styles: CssProprtyComponentType["styles"];
  title: string;
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

export const ColorPickerAsset: React.FC<ColorPickerProps> = (props) => {
  //Internal state is being used to record the last color dragged to in the palette.
  const [color, setColor] = useColor(
    "hex",
    (props.styles[props.styleItem] as string | undefined) || ""
  );
  function rgb2hex({ r, g, b, a }: Color["rgb"]): Color["hex"] {
    const hex = [r, g, b, a]
      .map((v, i) =>
        v !== undefined
          ? (i < 3 ? v : Math.round(v * 255)).toString(16).padStart(2, "0")
          : ""
      )
      .join("");

    return `#${hex}`;
  }

  useEffect(() => {
    setColor(
      toColor(
        "hex",
        (props.styles[props.styleItem] as string | undefined) || ""
      )
    );
  }, [props.styleItem, props.styles, setColor]);

  const handleChange = (
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
        onChange={setColor}
        onChangeComplete={(e) => handleChange(e.hex, props.styleItem)}
        hideHSV
        dark
      />
    </div>
  );
};
