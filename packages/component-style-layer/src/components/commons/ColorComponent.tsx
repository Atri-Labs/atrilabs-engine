import { gray100, gray800, gray400, smallText } from "@atrilabs/design-system";
import React, { useState, useEffect, useCallback } from "react";
import { ColorInput } from "./ColorInput";
import { CssProprtyComponentType } from "../../types";
import { ReactComponent as ET } from "../../assets/background/eye-off.svg";
import { ReactComponent as ENT } from "../../assets/background/eye.svg";

const styles: { [key: string]: React.CSSProperties } = {
  inputContainer: {
    display: "flex",
  },
  inputContainerBox: {
    ...smallText,
    outline: "none",
    color: gray100,
    padding: "3px",
    backgroundColor: gray800,
    width: "30px",
    border: "none",
    borderRadius: "2px 0 0 2px",
    lineHeight: "20px",
  },
  inputSpan: {
    ...smallText,
    color: gray400,
    backgroundColor: gray800,
    borderRadius: "0 2px 2px 0",
    display: "flex",
    alignItems: "center",
    paddingRight: "4px",
  },
  optionName: {
    ...smallText,
    display: "flex",
    alignItems: "center",
    width: "4rem",
    color: "white",
    height: "25px",
  },
};

export type ColorComponentProps = {
  name: string;
  styleItem: keyof React.CSSProperties;
  patchCb: CssProprtyComponentType["patchCb"];
  styles: CssProprtyComponentType["styles"];
  openPalette: (styleItem: keyof React.CSSProperties, name: string) => void;
};

export type Color = {
  hex: string;
  rgb: ColorRGB;
  hsv: ColorHSV;
};

export type ColorRGB = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

export type ColorHSV = {
  h: number;
  s: number;
  v: number;
  a?: number;
};

export const hex2rgb = (hex: Color["hex"]) => {
  hex = hex.slice(1);

  if (hex.length === 3 || hex.length === 4) {
    hex = hex
      .split("")
      .map(function (hex) {
        return hex + hex;
      })
      .join("");
  }

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  let a = parseInt(hex.slice(6, 8), 16) || undefined;
  if (a) {
    a = a / 255;
  }
  return { r, g, b, a };
};

export const rgb2hex = ({ r, g, b, a }: Color["rgb"]) => {
  const hex = [r, g, b, a]
    .map((v, i) =>
      v !== undefined
        ? (i < 3 ? v : Math.round(v * 255)).toString(16).padStart(2, "0")
        : ""
    )
    .join("");
  return `#${hex}`;
};

export const getOpacityValue = (hex: Color["hex"]) => {
  let convertedRgbValue = hex2rgb(hex);
  if (convertedRgbValue.a === undefined) {
    return "";
  } else if (convertedRgbValue.a) {
    Math.ceil(convertedRgbValue.a * 100) - convertedRgbValue.a * 100 < 0.5
      ? (convertedRgbValue.a = Math.ceil(convertedRgbValue.a * 100))
      : (convertedRgbValue.a = Math.floor(convertedRgbValue.a * 100));

    return String(convertedRgbValue.a);
  } else {
    return "100";
  }
};

export const ColorComponent: React.FC<ColorComponentProps> = (props) => {
  const toggleTransparencyChange = (styleItem: keyof React.CSSProperties) => {
    props.patchCb({
      property: {
        styles: {
          [styleItem]:
            props.styles[props.styleItem] === "transparent"
              ? ""
              : "transparent",
        },
      },
    });
  };

  const handleOpacityInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    styleItem: keyof React.CSSProperties
  ) => {
    parseInt(e.target.value) > 100
      ? setOpacityValue("100")
      : setOpacityValue(e.target.value);

    props.patchCb({
      property: {
        styles: {
          [styleItem]:
            e.target.value !== ""
              ? handleOpacityChange(
                  String(Number(e.target.value) / 100),
                  String(props.styles[props.styleItem])
                )
              : handleOpacityChange(
                  String(e.target.value),
                  String(props.styles[props.styleItem])
                ),
        },
      },
    });
  };
  const handleOpacityChange = useCallback(
    (opacityValue: string, hex: Color["hex"]) => {
      let convertedRgbValue = hex2rgb(hex);
      if (opacityValue === "") {
        convertedRgbValue.a = 0;
      } else if (opacityHelper(opacityValue) >= 1) {
        convertedRgbValue.a = 1;
      } else if (opacityHelper(opacityValue) < 0) {
        convertedRgbValue.a = 0;
      } else {
        convertedRgbValue.a = opacityHelper(opacityValue);
      }
      return rgb2hex(convertedRgbValue);
    },
    []
  );
  const opacityHelper = (opacityValue: string) => {
    let opacityHelperValue;
    opacityValue === ""
      ? (opacityHelperValue = 100)
      : (opacityHelperValue = Number(opacityValue));
    return opacityHelperValue;
  };

  const opacityDisabledHandler = (Color: string) => {
    let Flag;
    Color === "undefined" ? (Flag = true) : (Flag = false);
    return Flag;
  };

  const [opacityValue, setOpacityValue] = useState<string>(
    props.styles[props.styleItem]
      ? getOpacityValue(String(props.styles[props.styleItem]))
      : "100"
  );

  const [isOpacityDisabled, setIsOpacityDisabled] = useState<boolean>(
    opacityDisabledHandler(String(props.styles[props.styleItem]))
  );

  useEffect(() => {
    setOpacityValue(
      props.styles[props.styleItem]
        ? getOpacityValue(String(props.styles[props.styleItem]))
        : "100"
    );
  }, [props]);

  useEffect(() => {
    setIsOpacityDisabled(
      opacityDisabledHandler(String(props.styles[props.styleItem]))
    );
  }, [props]);

  const [colorVal, setColorVal] = useState<string>("");

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        onClick={() => {
          props.openPalette(props.styleItem, props.name);
        }}
        style={{ width: "55px", marginRight: "10px" }}
      >
        <ColorInput
          styleItem={props.styleItem}
          styles={props.styles}
          patchCb={props.patchCb}
          defaultValue=""
          getOpacityValue={getOpacityValue}
          setOpacityValue={setOpacityValue}
          rgb2hex={rgb2hex}
          value={colorVal}
          setValue={setColorVal}
          applyFlag={true}
          index={0}
        />
      </div>
      <div style={{ width: "45px", marginRight: "10px" }}>
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={opacityValue}
            disabled={isOpacityDisabled}
            onChange={(e) => handleOpacityInputChange(e, props.styleItem)}
            style={styles.inputContainerBox}
            placeholder="100"
          />
          <div style={styles.inputSpan}>%</div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={(e) => toggleTransparencyChange(props.styleItem)}
      >
        {props.styles[props.styleItem] === "transparent" ? <ET /> : <ENT />}
      </div>
    </div>
  );
};
