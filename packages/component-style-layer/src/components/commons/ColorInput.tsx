import { gray100, gray800, smallText } from "@atrilabs/design-system";
import React, { useState, useEffect } from "react";
import { CssProprtyComponentType } from "../../types";
import { getOpacityValue } from "../background/Background";
import { ColorRGB } from "../background/Background";

export type InputProps = {
  styleItem: keyof React.CSSProperties;
  patchCb: CssProprtyComponentType["patchCb"];
  styles: CssProprtyComponentType["styles"];
  defaultValue: string;
  getOpacityValue: (input: string) => string;
  setOpacityValue: (input: string) => void;
  rgb2hex: (input: ColorRGB) => string;
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

const toRGBAObject = (rgbaStr: string) => {
  let colorArr = rgbaStr
    .slice(rgbaStr.indexOf("(") + 1, rgbaStr.indexOf(")"))
    .split(", ");
  let rgbaObj = {
    r: parseInt(colorArr[0]),
    g: parseInt(colorArr[1]),
    b: parseInt(colorArr[2]),
    a: Number(colorArr[3]) || 1,
  };

  return rgbaObj;
};
export const ColorInput: React.FC<InputProps> = (props) => {
  const convertToSixDigitHex = (colorVal: string) => {
    colorVal = colorVal.slice(1);
    if (colorVal.length === 3 || colorVal.length === 4) {
      colorVal = colorVal
        .split("")
        .map(function (hex) {
          return hex + hex;
        })
        .join("");
    }
    colorVal = "#" + colorVal;
    return colorVal;
  };

  const hexColorInputValidator = (
    e: React.ChangeEvent<HTMLInputElement>,
    styleItem: keyof React.CSSProperties
  ) => {
    let recievedColor = e.target.value;
    if (recievedColor.length === 4) {
      recievedColor = convertToSixDigitHex(recievedColor);
      onValidInput(recievedColor, styleItem);
    } else if (recievedColor.length === 7) {
      onValidInput(recievedColor, styleItem);
    }
    if (recievedColor.length === 5) {
      recievedColor = convertToSixDigitHex(recievedColor);
      onValidInput(recievedColor, styleItem);
      props.setOpacityValue(getOpacityValue(recievedColor));
    } else if (recievedColor.length === 9) {
      onValidInput(recievedColor, styleItem);
      props.setOpacityValue(getOpacityValue(recievedColor));
    }
  };
  const rgbaColorInputValidator = (
    recievedColor: string,
    styleItem: keyof React.CSSProperties
  ) => {
    onValidInput(recievedColor, styleItem);
    props.setOpacityValue(getOpacityValue(recievedColor));
  };
  const colorValueTrim = (colorVal: string) => {
    let trimmedColorVal;
    colorVal === "undefined"
      ? (trimmedColorVal = "")
      : (trimmedColorVal = colorVal);
    if (colorVal.length === 5) {
      colorVal = convertToSixDigitHex(colorVal);
      trimmedColorVal = colorVal.substring(0, 7);
    } else if (colorVal.length >= 9) {
      trimmedColorVal = colorVal.substring(0, 7);
    }
    return trimmedColorVal;
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
    recievedColor: string,
    styleItem: keyof React.CSSProperties
  ) => {
    props.patchCb({
      property: {
        styles: {
          [styleItem]: recievedColor,
        },
      },
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    styleItem: keyof React.CSSProperties
  ) => {
    if (e.target.value.substring(0, 1) === "#") {
      console.log("hex detected");
      setColorValue(colorValueTrim(e.target.value));
      hexColorInputValidator(e, styleItem);
    } else if (
      e.target.value.substring(0, 3).toLowerCase() === "rgb" ||
      e.target.value.substring(0, 4).toLowerCase() === "rgba"
    ) {
      setColorValue(
        colorValueTrim(props.rgb2hex(toRGBAObject(e.target.value)))
      );
      rgbaColorInputValidator(
        props.rgb2hex(toRGBAObject(e.target.value)),
        styleItem
      );
    } else {
      setColorValue(e.target.value);
    }
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
