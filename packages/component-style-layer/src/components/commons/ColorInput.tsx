import { gray100, gray800, smallText } from "@atrilabs/design-system";
import React, { useState, useEffect } from "react";
import { CssProprtyComponentType } from "../../types";
import { getOpacityValue } from "./ColorComponent";
import { ColorRGB } from "./ColorComponent";

export type InputProps = {
  styleItem: keyof React.CSSProperties;
  patchCb: CssProprtyComponentType["patchCb"];
  styles: CssProprtyComponentType["styles"];
  defaultValue: string;
  getOpacityValue: (input: string) => string;
  setOpacityValue: (input: string) => void;
  rgb2hex: (input: ColorRGB) => string;
};
export type rgbaObjectProps = {
  r: number;
  g: number;
  b: number;
  a: number;
};

const styles: { [key: string]: React.CSSProperties } = {
  inputBox: {
    ...smallText,
    outline: "none",
    color: gray100,
    backgroundColor: gray800,
    width: "54px",
    border: "none",
    borderRadius: "2px",
    height: "24px",
  },
};

const toRGBAObject = (rgbaStr: string) => {
  let colorArr = rgbaStr
    .slice(rgbaStr.indexOf("(") + 1, rgbaStr.indexOf(")"))
    .split(",");
  let rgbaObj: rgbaObjectProps = {
    r: parseInt(colorArr[0]),
    g: parseInt(colorArr[1]),
    b: parseInt(colorArr[2]),
    a: Number(colorArr[3]) || 1,
  };

  return rgbaObj;
};

export const ColorInput: React.FC<InputProps> = (props) => {
  const trimForInputBox = (value: string) => {
    if (value.length === 5) {
      return value.substring(0, 4);
    } else if (value.length === 9) {
      return value.substring(0, 7);
    } else {
      return value;
    }
  };

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

  const hexColorInputValidator = (recievedColor: string) => {
    if (recievedColor === "") {
      onValidInput("");
    } else if (recievedColor.length === 4) {
      recievedColor = convertToSixDigitHex(recievedColor);
      onValidInput(recievedColor);
      props.setOpacityValue(getOpacityValue(`${recievedColor} + ff`));
    } else if (recievedColor.length === 7) {
      onValidInput(recievedColor);
      props.setOpacityValue(getOpacityValue(`${recievedColor} + ff`));
    } else if (recievedColor.length === 5) {
      recievedColor = convertToSixDigitHex(recievedColor);
      onValidInput(recievedColor);
      props.setOpacityValue(getOpacityValue(recievedColor));
    } else if (recievedColor.length === 9) {
      onValidInput(recievedColor);
      props.setOpacityValue(getOpacityValue(recievedColor));
    } else {
      setColorValue(trimForInputBox(String(props.styles[props.styleItem])));
      props.setOpacityValue(
        getOpacityValue(String(props.styles[props.styleItem]))
      );
    }
  };

  const rgbaColorInputValidator = (recievedColor: string) => {
    onValidInput(recievedColor);
    props.setOpacityValue(getOpacityValue(recievedColor));
  };

  const [colorValue, setColorValue] = useState<string>(
    String(props.styles[props.styleItem])
  );

  useEffect(() => {
    const propertyColorValue = String(props.styles[props.styleItem]);
    if (
      propertyColorValue === "undefined" ||
      propertyColorValue === "transparent"
    ) {
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

  const onValidInput = (recievedColor: string) => {
    setColorValue(recievedColor);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
    }
    if (e.target.value.substring(0, 1) === "#") {
      if ("inputType" in e.nativeEvent) {
        setColorValue(e.target.value);
      }
    } else if (
      (e.target.value.substring(0, 3).toLowerCase() === "rgb" &&
        e.target.value[e.target.value.length - 1] === ")") ||
      (e.target.value.substring(0, 4).toLowerCase() === "rgba" &&
        e.target.value[e.target.value.length - 1] === ")")
    ) {
      setColorValue(props.rgb2hex(toRGBAObject(e.target.value)));
    } else {
      setColorValue(e.target.value);
    }
  };

  const applyColor = () => {
    if (colorValue.substring(0, 1) === "#") {
      hexColorInputValidator(colorValue);
      if (colorValue.length === 4) {
        props.patchCb({
          property: {
            styles: {
              [props.styleItem]: colorValue + "f",
            },
          },
        });
      } else if (colorValue.length === 7) {
        props.patchCb({
          property: {
            styles: {
              [props.styleItem]: colorValue + "ff",
            },
          },
        });
      } else if (colorValue.length === 5 || colorValue.length === 9) {
        props.patchCb({
          property: {
            styles: {
              [props.styleItem]: colorValue,
            },
          },
        });
      }
    } else if (
      (colorValue.substring(0, 3).toLowerCase() === "rgb" &&
        colorValue[colorValue.length - 1] === ")") ||
      (colorValue.substring(0, 4).toLowerCase() === "rgba" &&
        colorValue[colorValue.length - 1] === ")")
    ) {
      rgbaColorInputValidator(props.rgb2hex(toRGBAObject(colorValue)));
      props.patchCb({
        property: {
          styles: {
            [props.styleItem]: colorValue,
          },
        },
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      applyColor();
    }
  };

  return (
    <div>
      <input
        type="text"
        value={colorValue}
        placeholder={props.defaultValue}
        onChange={(e) => handleChange(e)}
        onBlur={(e) => applyColor()}
        onKeyDown={(e) => handleKeyDown(e)}
        style={styles.inputBox}
      />
    </div>
  );
};
