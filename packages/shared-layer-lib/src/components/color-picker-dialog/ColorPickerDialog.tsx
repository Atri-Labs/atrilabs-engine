import React, { useEffect } from "react";
import { ColorPicker, useColor, toColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
import { Cross } from "../../assets/Cross";
import { h5Heading } from "@atrilabs/design-system";

export type ColorPickerDialogProps = {
  onCrossClick: () => void;
  onChange: (color: string) => void;
  value: string;
  title: string;
};

export const ColorPickerDialog: React.FC<ColorPickerDialogProps> = (props) => {
  //Internal state is being used to record the last color dragged to in the palette.
  const [color, setColor] = useColor("hex", props.value || "");

  useEffect(() => {
    setColor(toColor("hex", props.value || ""));
  }, [props.value, setColor]);

  const handleChange = (color: string) => {
    props.onChange(color);
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
        onClick={props.onCrossClick}
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
        onChangeComplete={(e) => handleChange(e.hex)}
        hideHSV
        dark
      />
    </div>
  );
};
