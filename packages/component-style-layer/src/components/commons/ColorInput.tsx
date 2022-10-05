import { gray100, gray800, smallText } from "@atrilabs/design-system";
import React, { useState, useEffect, useCallback } from "react";
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
  applyFlag: boolean;
  value: string;
  setValue: (value: string) => void;
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
    if (recievedColor === "") {
      onValidInput("", styleItem);
    }
    if ("inputType" in e.nativeEvent) {
      if (
        recievedColor.length === 4 &&
        (e.nativeEvent as InputEvent).inputType !== "deleteContentBackward"
      ) {
        recievedColor = convertToSixDigitHex(recievedColor);
        onValidInput(recievedColor, styleItem);
        props.setOpacityValue(getOpacityValue(`${recievedColor} + ff`));
      } else if (recievedColor.length === 7) {
        onValidInput(recievedColor, styleItem);
        props.setOpacityValue(getOpacityValue(`${recievedColor} + ff`));
      }
      if (
        recievedColor.length === 5 &&
        (e.nativeEvent as InputEvent).inputType !== "deleteContentBackward"
      ) {
        recievedColor = convertToSixDigitHex(recievedColor);
        onValidInput(recievedColor, styleItem);
        props.setOpacityValue(getOpacityValue(recievedColor));
      } else if (recievedColor.length === 9) {
        onValidInput(recievedColor, styleItem);
        props.setOpacityValue(getOpacityValue(recievedColor));
      }
    }
  };
  const rgbaColorInputValidator = (
    recievedColor: string,
    styleItem: keyof React.CSSProperties
  ) => {
    onValidInput(recievedColor, styleItem);
    props.setOpacityValue(getOpacityValue(recievedColor));
  };
  const colorValueTrim = useCallback(
    (typeOfInput: string, colorVal: string) => {
      let trimmedColorVal;
      colorVal === "undefined"
        ? (trimmedColorVal = "")
        : (trimmedColorVal = colorVal);

      if (colorVal.length === 5 && typeOfInput !== "deleteContentBackward") {
        colorVal = convertToSixDigitHex(colorVal);
        trimmedColorVal = colorVal.substring(0, 7);
      } else if (colorVal.length >= 9) {
        trimmedColorVal = colorVal.substring(0, 7);
      }
      return trimmedColorVal;
    },
    []
  );

  const [colorValue, setColorValue] = useState<string>(
    props.applyFlag
      ? colorValueTrim("insertText", String(props.styles[props.styleItem]))
      : colorValueTrim("insertText", props.value)
  );

  // useEffect(() => {
  //   console.log(props.applyFlag, props.styleItem);
  //   console.log(
  //     props.applyFlag
  //       ? colorValueTrim("insertText", String(props.styles[props.styleItem]))
  //       : colorValueTrim("insertText", props.value)
  //   );
  // }, [
  //   props.value,
  //   props.applyFlag,
  //   colorValueTrim,
  //   props.styleItem,
  //   props.styles,
  // ]);

  useEffect(() => {
    if (props.applyFlag) {
      setColorValue(
        colorValueTrim("insertText", String(props.styles[props.styleItem]))
      );
    } else if (!props.applyFlag) {
      setColorValue(colorValueTrim("insertText", props.value));
    }
  }, [props, colorValueTrim]);

  useEffect(() => {
    if (props.applyFlag) {
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
    } else if (!props.applyFlag) {
      setColorValue(colorValueTrim("insertText", props.value));
    }
  }, [props, colorValueTrim]);

  const onValidInput = (
    recievedColor: string,
    styleItem: keyof React.CSSProperties
  ) => {
    if (props.applyFlag) {
      props.patchCb({
        property: {
          styles: {
            [styleItem]: recievedColor,
          },
        },
      });
    } else if (!props.applyFlag) {
      props.setValue(recievedColor);
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    styleItem: keyof React.CSSProperties
  ) => {
    if (e.target.value === "") {
      hexColorInputValidator(e, styleItem);
    }

    if (e.target.value.substring(0, 1) === "#") {
      if ("inputType" in e.nativeEvent) {
        if (props.applyFlag) {
          setColorValue(
            colorValueTrim(
              (e.nativeEvent as InputEvent).inputType,
              e.target.value
            )
          );
        }
        if (!props.applyFlag) {
          props.setValue(
            colorValueTrim(
              (e.nativeEvent as InputEvent).inputType,
              e.target.value
            )
          );
        }
      }

      hexColorInputValidator(e, styleItem);
    } else if (
      (e.target.value.substring(0, 3).toLowerCase() === "rgb" &&
        e.target.value[e.target.value.length - 1] === ")") ||
      (e.target.value.substring(0, 4).toLowerCase() === "rgba" &&
        e.target.value[e.target.value.length - 1] === ")")
    ) {
      if (props.applyFlag) {
        setColorValue(
          colorValueTrim(
            (e.nativeEvent as InputEvent).inputType,
            props.rgb2hex(toRGBAObject(e.target.value))
          )
        );
      }
      if (!props.applyFlag) {
        props.setValue(
          colorValueTrim(
            (e.nativeEvent as InputEvent).inputType,
            props.rgb2hex(toRGBAObject(e.target.value))
          )
        );
      }

      rgbaColorInputValidator(
        props.rgb2hex(toRGBAObject(e.target.value)),
        styleItem
      );
    } else {
      if (props.applyFlag) {
        setColorValue(e.target.value);
      }
      if (!props.applyFlag) {
        props.setValue(e.target.value);
      }
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
