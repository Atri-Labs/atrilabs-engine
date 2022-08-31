import {
  gray100,
  gray200,
  gray400,
  gray800,
  smallText,
  h5Heading,
} from "@atrilabs/design-system";
import React, { useState, useCallback, useEffect } from "react";
import { ReactComponent as BC } from "../../assets/border/border-color-icon.svg";
import { ReactComponent as BS } from "../../assets/border/border-style-icon.svg";
import { ReactComponent as BW } from "../../assets/border/border-width-icon.svg";
import { ReactComponent as DropDownArrow } from "../../assets/layout-parent/dropdown-icon.svg";
import { CssProprtyComponentType } from "../../types";
import { ColorInput } from "../commons/ColorInput";
import { SizeInputWithUnits } from "../commons/SizeInputWithUnits";

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
    paddingTop: "1.2rem",
    paddingBottom: "1.8rem",
    borderBottom: `1px solid ${gray800}`,
    rowGap: "1.2rem",
  },
  header: {
    ...h5Heading,
    color: gray200,
    display: "flex",
    paddingLeft: "0.5rem",
    userSelect: "none",
  },
  inputBox: {
    ...smallText,
    outline: "none",
    color: gray100,
    backgroundColor: gray800,
    width: "57px",
    height: "26px",
    border: "none",
    borderRadius: "2px",
  },
  drop: {
    display: "flex",
    alignItems: "baseline",
  },
  optionName: {
    ...smallText,
    width: "1.5rem",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  select: {
    textAlign: "left",
  },
  gridContainer: {
    ...smallText,
    color: gray400,
    display: "grid",
    gridTemplateColumns: "15px 60px 15px 60px",
    rowGap: "1rem",
    textAlign: "center",
    columnGap: "1rem",
  },
  gridInputContainer: {
    ...smallText,
    color: gray400,
    display: "grid",
    gridTemplateColumns: "15px 60px 40px",
    rowGap: "1rem",
    textAlign: "center",
    columnGap: "1rem",
  },
  inputContainer: {
    display: "flex",
  },
  inputContainerBox: {
    ...smallText,
    outline: "none",
    color: gray100,
    backgroundColor: gray800,
    width: "30px",
    border: "none",
    height: "24px",
    borderRadius: "2px 0 0 2px",
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

export const Outline: React.FC<CssProprtyComponentType> = (props) => {
  const getOpacityValue = (hex: Color["hex"]) => {
    let convertedRgbValue = hex2rgb(hex);
    if (convertedRgbValue.a) {
      Math.ceil(convertedRgbValue.a * 100) - convertedRgbValue.a * 100 < 0.5
        ? (convertedRgbValue.a = Math.ceil(convertedRgbValue.a * 100))
        : (convertedRgbValue.a = Math.floor(convertedRgbValue.a * 100));

      return String(convertedRgbValue.a);
    } else {
      return "100";
    }
  };
  const [showProperties, setShowProperties] = useState(true);
  const [opacityValue, setOpacityValue] = useState<string>(
    props.styles.outlineColor
      ? getOpacityValue(props.styles.outlineColor)
      : "100"
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    parseInt(e.target.value) > 100
      ? setOpacityValue("100")
      : setOpacityValue(e.target.value);

    props.patchCb({
      property: {
        styles: {
          outlineColor:
            e.target.value !== ""
              ? handleOpacityChange(
                  String(Number(e.target.value) / 100),
                  String(props.styles.backgroundColor)
                )
              : handleOpacityChange(
                  String(e.target.value),
                  String(props.styles.backgroundColor)
                ),
        },
      },
    });
  };

  const opacityHelper = (opacityValue: string) => {
    let opacityHelperValue;
    opacityValue === ""
      ? (opacityHelperValue = 100)
      : (opacityHelperValue = Number(opacityValue));
    return opacityHelperValue;
  };

  const handleOpacityChange = useCallback(
    (opacityValue: string, hex: Color["hex"]) => {
      let convertedRgbValue = hex2rgb(hex);
      if (opacityHelper(opacityValue) >= 1) {
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
  const handleOutlineChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
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

  const opacityDisabledHandler = (ocColor: string) => {
    let ocFlag;
    ocColor === "undefined" ? (ocFlag = true) : (ocFlag = false);
    return ocFlag;
  };
  useEffect(() => {
    setIsOpacityDisabled(
      opacityDisabledHandler(String(props.styles.outlineColor))
    );
  }, [props]);

  const [isOpacityDisabled, setIsOpacityDisabled] = useState<boolean>(
    opacityDisabledHandler(String(props.styles.outlineColor))
  );

  return (
    <div style={styles.container}>
      <div style={styles.drop}>
        <DropDownArrow
          onClick={() => setShowProperties(!showProperties)}
          style={
            !showProperties
              ? { transform: "rotate(-90deg)" }
              : { transform: "rotate(0deg)" }
          }
        />
        <div style={styles.header}>Outline</div>
      </div>
      <div
        style={
          showProperties
            ? { display: "flex", rowGap: "1rem", flexDirection: "column" }
            : { display: "none" }
        }
      >
        <div style={styles.gridContainer}>
          <div style={styles.optionName}>
            <BW />
          </div>
          <div>
            <SizeInputWithUnits
              styleItem="outlineWidth"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue="1"
            />
          </div>
          <div style={styles.optionName}>
            <div style={{ ...smallText, color: gray200 }}>Offset</div>
          </div>
          <div>
            <SizeInputWithUnits
              styleItem="outlineOffset"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue="0"
            />
          </div>
          <div style={styles.optionName}>
            <BS />
          </div>
          <div style={{ marginLeft: "-2px" }}>
            <select
              name="outlineStyle"
              onChange={(e) => handleOutlineChange(e, "outlineStyle")}
              style={styles.inputBox}
              value={props.styles.outlineStyle || ""}
            >
              <option style={styles.select} value={""}></option>
              <option style={styles.select} value="dotted">
                dotted
              </option>
              <option style={styles.select} value="dashed">
                dashed
              </option>
              <option style={styles.select} value="solid">
                solid
              </option>
              <option style={styles.select} value="double">
                double
              </option>
              <option style={styles.select} value="groove">
                groove
              </option>
              <option style={styles.select} value="ridge">
                ridge
              </option>
              <option style={styles.select} value="inset">
                inset
              </option>
              <option style={styles.select} value="outset">
                outset
              </option>
              <option style={styles.select} value="none">
                none
              </option>
              <option style={styles.select} value="hidden">
                hidden
              </option>
            </select>
          </div>
        </div>
        <div style={styles.gridInputContainer}>
          <div style={styles.optionName}>
            <BC />
          </div>
          <div
            onClick={() => {
              props.openPalette("outlineColor", "Outline Color");
            }}
          >
            <ColorInput
              styleItem="outlineColor"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue=""
              getOpacityValue={getOpacityValue}
              setOpacityValue={setOpacityValue}
              rgb2hex={rgb2hex}
            />
          </div>
          <div style={{ width: "45px", marginRight: "10px" }}>
            <div style={styles.inputContainer}>
              <input
                type="text"
                value={opacityValue}
                disabled={isOpacityDisabled}
                onChange={handleChange}
                style={styles.inputContainerBox}
                placeholder="100"
              />
              <div style={styles.inputSpan}>%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
