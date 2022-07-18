import React from "react";
import { CssProprtyComponentType } from "../../types";
import { ColorPicker, useColor } from "react-color-palette";
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

export const ColorPickerAsset: React.FC<ColorPickerProps> = (props) => {
  //Internal state is being used to record the last color dragged to in the palette.
  const [color, setColor] = useColor(
    "hex",
    (props.styles[props.styleItem] as string | undefined) || ""
  );

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
