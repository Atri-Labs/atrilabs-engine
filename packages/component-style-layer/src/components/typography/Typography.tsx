import {
  gray200,
  smallText,
  h5Heading,
  gray100,
  gray800,
  gray400,
} from "@atrilabs/design-system";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ReactComponent as DropDownArrow } from "../../assets/layout-parent/dropdown-icon.svg";
import { ReactComponent as LA } from "../../assets/typo/left-align.svg";
import { ReactComponent as RA } from "../../assets/typo/right-align.svg";
import { ReactComponent as CA } from "../../assets/typo/center-align.svg";
import { ReactComponent as JA } from "../../assets/typo/justify-align.svg";
import { CssProprtyComponentType } from "../../types";
import PropertyRender from "../commons/PropertyRender";
import { SizeInputWithUnits } from "../commons/SizeInputWithUnits";
import { useGetFontImports } from "../../hooks/useGetFontImports";
import { ColorInput } from "../commons/ColorInput";
import {
  Color,
  getOpacityValue,
  hex2rgb,
  rgb2hex,
} from "../background/Background";
import { ReactComponent as ET } from "../../assets/background/eye-off.svg";
import { ReactComponent as ENT } from "../../assets/background/eye.svg";

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
  drop: {
    display: "flex",
    alignItems: "baseline",
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
    color: gray100,
    backgroundColor: gray800,
    outline: "none",
    height: "28px",
    border: "none",
    borderRadius: "2px",
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
  inputBoxWithUnits: {
    ...smallText,
    textAlign: "center",
  },
  select: {
    textAlign: "left",
  },

  option: {
    display: "flex",
    height: "25px",
    alignItems: "center",
  },
  optionName: {
    ...smallText,
    color: "white",
    width: "4rem",
  },
  inputContainer: {
    display: "flex",
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

function isStringANumber(str: string) {
  return str.match(/^[0-9]+$/g) ? true : false;
}

const textAlignValues = ["left", "right", "center", "justify"];

const weightNameMap: { [weight: string | number]: string } = {
  100: "Thin",
  200: "Extra Light",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "Semi Bold",
  700: "Bold",
  800: "Extra Bold",
  900: "Black",
};

// This serves as a Semi-Smart component, i.e. it uses useMemo but not useState or useRef.
export const Typography: React.FC<CssProprtyComponentType> = (props) => {
  const [showProperties, setShowProperties] = useState(true);
  const { formattedFontInfo, fontFamilies } = useGetFontImports();

  const fontWeights = useMemo(() => {
    return props.styles.fontFamily &&
      props.styles.fontFamily in formattedFontInfo
      ? Array.from(
          new Set(formattedFontInfo[props.styles.fontFamily].fontWeights)
        )
      : [];
  }, [formattedFontInfo, props.styles]);

  const fontStyles = useMemo(() => {
    return props.styles.fontFamily &&
      props.styles.fontFamily in formattedFontInfo
      ? Array.from(
          new Set(formattedFontInfo[props.styles.fontFamily].fontStyles)
        )
      : [];
  }, [formattedFontInfo, props.styles]);

  const handleFontWeightChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLSelectElement>,
      fontItem: keyof React.CSSProperties
    ) => {
      props.patchCb({
        property: {
          styles: {
            [fontItem]: isStringANumber(e.target.value)
              ? parseInt(e.target.value)
              : e.target.value,
          },
        },
      });
    },
    [props]
  );

  const handleFontStyleChange = useCallback(
    (
      e: React.ChangeEvent<HTMLSelectElement>,
      fontItem: keyof React.CSSProperties
    ) => {
      props.patchCb({
        property: {
          styles: {
            [fontItem]: e.target.value,
          },
        },
      });
    },
    [props]
  );

  const handleFontFamChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      props.patchCb({
        property: {
          styles: {
            fontFamily: e.target.value,
          },
        },
      });
    },
    [props]
  );

  const [opacityValue, setOpacityValue] = useState<string>(
    props.styles.color ? getOpacityValue(props.styles.color) : "100"
  );
  useEffect(() => {
    setOpacityValue(
      props.styles.color ? getOpacityValue(props.styles.color) : "100"
    );
  }, [props]);
  const opacityDisabledHandler = (bgColor: string) => {
    let bgFlag;
    bgColor === "undefined" ? (bgFlag = true) : (bgFlag = false);
    return bgFlag;
  };
  const [isOpacityDisabled, setIsOpacityDisabled] = useState<boolean>(
    opacityDisabledHandler(String(props.styles.color))
  );
  useEffect(() => {
    setIsOpacityDisabled(opacityDisabledHandler(String(props.styles.color)));
  }, [props]);
  const opacityHelper = (opacityValue: string) => {
    let opacityHelperValue;
    opacityValue === ""
      ? (opacityHelperValue = 100)
      : (opacityHelperValue = Number(opacityValue));
    return opacityHelperValue;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    parseInt(e.target.value) > 100
      ? setOpacityValue("100")
      : setOpacityValue(e.target.value);

    props.patchCb({
      property: {
        styles: {
          color:
            e.target.value !== ""
              ? handleOpacityChange(
                  String(Number(e.target.value) / 100),
                  String(props.styles.color)
                )
              : handleOpacityChange(
                  String(e.target.value),
                  String(props.styles.color)
                ),
        },
      },
    });
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
  const [isTransparent, setIsTransparent] = useState<boolean>(
    props.styles.color === "transparent" ? true : false
  );
  useEffect(() => {
    setIsTransparent(props.styles.color === "transparent" ? true : false);
  }, [props]);
  const toggleTransparencyChange = () => {
    props.patchCb({
      property: {
        styles: {
          color: isTransparent ? "" : "transparent",
        },
      },
    });
  };

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
        <div style={styles.header}>Typography</div>
      </div>
      <div
        style={
          showProperties
            ? { display: "flex", rowGap: "1rem", flexDirection: "column" }
            : { display: "none" }
        }
      >
        <div style={styles.option}>
          <div style={styles.optionName}>Font</div>
          <div>
            <select
              name="fontFamily"
              style={{ ...styles.inputBox, width: "145px" }}
              onChange={(e) => handleFontFamChange(e)}
              value={props.styles.fontFamily || ""}
            >
              <option value={""}>{""}</option>
              {fontFamilies.map((family, index) => (
                <option
                  key={family + index}
                  style={styles.select}
                  value={family}
                >
                  {family}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div style={styles.option}>
          <div style={styles.optionName}>Weight</div>
          <div style={{ display: "flex", columnGap: "20px" }}>
            <select
              name="font"
              onChange={(e) => handleFontWeightChange(e, "fontWeight")}
              style={{ ...styles.inputBox, width: "65px" }}
              value={props.styles.fontWeight || ""}
            >
              <option value={""}>{""}</option>
              {fontWeights.map((fontWeight, index) => {
                return (
                  <option style={styles.select} value={fontWeight} key={index}>
                    {weightNameMap[fontWeight]
                      ? weightNameMap[fontWeight]
                      : fontWeight}
                  </option>
                );
              })}
            </select>
            <div style={styles.inputBoxWithUnits}>
              <SizeInputWithUnits
                styleItem="fontSize"
                styles={props.styles}
                patchCb={props.patchCb}
                defaultValue=""
              />
            </div>
          </div>
        </div>
        <div style={styles.option}>
          <div style={styles.optionName}>Style</div>
          <select
            name="font"
            onChange={(e) => handleFontStyleChange(e, "fontWeight")}
            style={{ ...styles.inputBox, width: "65px" }}
            value={props.styles.fontStyle || ""}
          >
            <option value={""}>{""}</option>
            {fontStyles.map((fontStyle, index) => {
              return (
                <option style={styles.select} value={fontStyle} key={index}>
                  {fontStyle}
                </option>
              );
            })}
          </select>
        </div>
        <PropertyRender
          styleItem="textAlign"
          styleText="Align"
          styleArray={textAlignValues}
          patchCb={props.patchCb}
          styles={props.styles}
        >
          <LA />
          <RA />
          <CA />
          <JA />
        </PropertyRender>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={styles.optionName}>Color</div>
          <div
            onClick={() => {
              props.openPalette("color", "Color");
            }}
            style={{ width: "55px", marginRight: "10px" }}
          >
            <ColorInput
              styleItem="color"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue=""
              getOpacityValue={getOpacityValue}
              setOpacityValue={getOpacityValue}
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              userSelect: "none",
            }}
            onClick={toggleTransparencyChange}
          >
            {isTransparent ? <ET /> : <ENT />}
          </div>
        </div>
      </div>
    </div>
  );
};
