import {
  gray200,
  smallText,
  h5Heading,
  gray100,
  gray800,
} from "@atrilabs/design-system";
import React, { useCallback, useMemo, useState } from "react";
import { ReactComponent as DropDownArrow } from "../../assets/layout-parent/dropdown-icon.svg";
import { ReactComponent as LA } from "../../assets/typo/left-align.svg";
import { ReactComponent as RA } from "../../assets/typo/right-align.svg";
import { ReactComponent as CA } from "../../assets/typo/center-align.svg";
import { ReactComponent as JA } from "../../assets/typo/justify-align.svg";
import { ReactComponent as MH } from "../../assets/typo/more-horizontal.svg";
import { CssProprtyComponentType } from "../../types";
import PropertyRender from "../commons/PropertyRender";
import { InputWithPreprocessor } from "../commons/InputWithPreprocessor";
import { Input } from "../commons/Input";
import { SizeInputWithUnits } from "../commons/SizeInputWithUnits";
import { useGetFontImports } from "../../hooks/useGetFontImports";

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "0.5rem",
    borderBottom: "1px solid #111827",
  },
  header: {
    ...h5Heading,
    color: gray200,
    display: "flex",
    marginTop: "10px",
    paddingBottom: "0.5rem",
    height: "25px",
    paddingLeft: "0.5rem",
    userSelect: "none",
  },
  inputBox: {
    ...smallText,
    outline: "none",
    color: gray100,
    backgroundColor: gray800,
    height: "28px",
    border: "none",
    borderRadius: "2px",
  },
  inputBoxWithUnits: {
    ...smallText,
    textAlign: "center",
  },
  select: {
    textAlign: "left",
  },
  drop: {
    display: "flex",
    alignItems: "baseline",
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

  const opacityPreProcessor = useCallback(
    (value: string | number | undefined, mode: "read" | "write") => {
      if (value === "" || (typeof value === "string" && !value.trim().length)) {
        return "";
      } else if (typeof value === "undefined") {
        return "";
      } else if (mode === "read") {
        if (typeof value === "number") {
          return value * 100;
        } else {
          return parseFloat(value) * 100;
        }
      } else {
        if (typeof value === "number") {
          return value / 100;
        } else {
          return parseFloat(value) / 100;
        }
      }
    },
    []
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
          <select
            name="font"
            onChange={(e) => handleFontWeightChange(e, "fontWeight")}
            style={{ ...styles.inputBox, width: "65px", marginRight: "20px" }}
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
        <div style={styles.option}>
          <div style={styles.optionName}>Style</div>
          <select
            name="font"
            onChange={(e) => handleFontStyleChange(e, "fontWeight")}
            style={{ ...styles.inputBox, width: "65px", marginRight: "20px" }}
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
        <div style={styles.option}>
          <div style={styles.optionName}>Color</div>
          <div
            onClick={() => {
              props.openPalette("color", "Color");
            }}
            style={{ width: "55px", marginRight: "10px" }}
          >
            <Input
              styleItem="color"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue=""
              parseToInt={false}
            />
          </div>
          <div style={{ width: "45px", marginRight: "10px" }}>
            <InputWithPreprocessor
              styleItem="opacity"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue="100"
              placeHolderText="%"
              preProcessor={opacityPreProcessor}
            />
          </div>
          <div>
            <MH />
          </div>
        </div>
      </div>
    </div>
  );
};
