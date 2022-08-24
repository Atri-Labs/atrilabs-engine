import { gray100, gray800, smallText } from "@atrilabs/design-system";
import React, { useState, useEffect } from "react";
import { CssProprtyComponentType } from "../../types";
import { getOpacityValue } from "../background/Background";

export type InputProps = {
  styleItem: keyof React.CSSProperties;
  patchCb: CssProprtyComponentType["patchCb"];
  styles: CssProprtyComponentType["styles"];
  defaultValue: string;
  getOpacityValue: (hex: string) => string;
  setOpacityValue: (input: string) => void;
};

const styles: { [key: string]: React.CSSProperties } = {
  inputBox: {
    ...smallText,
    outline: "none",
    color: gray100,
    padding: "3px",
    backgroundColor: gray800,
    width: "50px",
    border: "none",
    borderRadius: "2px",
    lineHeight: "20px",
  },
};

const colorValueTrim = (colorVal: string) => {
  let trimmedColorVal;
  colorVal === "undefined"
    ? (trimmedColorVal = "")
    : (trimmedColorVal = colorVal);
  if (colorVal.length === 5) {
    trimmedColorVal = colorVal.substring(0, 4);
  } else if (colorVal.length >= 9) {
    trimmedColorVal = colorVal.substring(0, 7);
  }
  return trimmedColorVal;
};

export const ColorInput: React.FC<InputProps> = (props) => {
  const colorInputValidator = (
    input: string,
    e: React.ChangeEvent<HTMLInputElement>,
    styleItem: keyof React.CSSProperties
  ) => {
    if (input.length === 4 || input.length === 7) {
      onValidInput(e, styleItem);
    }

    if (input.length === 5 || input.length === 9) {
      onValidInput(e, styleItem);
      props.setOpacityValue(getOpacityValue(input));
    }
  };
  const [colorValue, setColorValue] = useState<string>(
    colorValueTrim(String(props.styles[props.styleItem]))
  );

  useEffect(() => {
    const propertyColorValue = String(props.styles[props.styleItem]);
    if (propertyColorValue === "undefined") {
      setColorValue("");
    } else if (propertyColorValue.length === 5) {
      setColorValue(propertyColorValue.substring(0, 4));
    } else if (propertyColorValue.length === 9) {
      setColorValue(propertyColorValue.substring(0, 7));
    } else if (
      propertyColorValue.length === 7 ||
      propertyColorValue.length === 4
    ) {
      setColorValue(propertyColorValue);
    }
  }, [props]);

  const onValidInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    styleItem: keyof React.CSSProperties
  ) => {
    props.patchCb({
      property: {
        styles: {
          [styleItem]: e.target.value,
        },
      },
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    styleItem: keyof React.CSSProperties
  ) => {
    console.log(e.target.value);
    setColorValue(colorValueTrim(e.target.value));
    colorInputValidator(e.target.value, e, styleItem);
  };
  return (
    <div>
      <input
        type="text"
        value={colorValue}
        placeholder={props.defaultValue}
        onChange={(e) => handleChange(e, props.styleItem)}
        style={styles.inputBox}
      />
    </div>
  );
};
