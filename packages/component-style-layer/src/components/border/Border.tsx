import {
  gray100,
  gray200,
  gray400,
  gray800,
  smallText,
  h5Heading,
  gray500,
} from "@atrilabs/design-system";
import React, { useState, useEffect } from "react";
import { ReactComponent as BC } from "../../assets/border/border-color-icon.svg";
import { ReactComponent as BR } from "../../assets/border/border-radius-icon.svg";
import { ReactComponent as BS } from "../../assets/border/border-style-icon.svg";
import { ReactComponent as BW } from "../../assets/border/border-width-icon.svg";
import { ReactComponent as DropDownArrow } from "../../assets/layout-parent/dropdown-icon.svg";
import { CssProprtyComponentType } from "../../types";
import { ColorComponent } from "../commons/ColorComponent";
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
  borderGrid: {
    ...smallText,
    color: gray400,
    display: "grid",
    gridTemplateColumns: "50px 50px 50px",
    rowGap: "1rem",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    columnGap: "1rem",
  },
  borderOption: {
    ...smallText,
    color: gray200,
    backgroundColor: gray500,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "4px",
    paddingBottom: "4px",
    cursor: "pointer",
  },
  gridInputContainer: {
    ...smallText,
    color: gray400,
    display: "grid",
    gridTemplateColumns: "15px 60px 40px 40px",
    rowGap: "1rem",
    textAlign: "center",
    columnGap: "1rem",
  },
  inputContainer: {
    display: "flex",
  },
};

export const Border: React.FC<CssProprtyComponentType> = (props) => {
  const [showProperties, setShowProperties] = useState(true);

  const handleBorderChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    styleItem: keyof React.CSSProperties
  ) => {
    console.log(styleItem);
    props.patchCb({
      property: {
        styles: {
          [styleItem]: e.target.value,
        },
      },
    });
  };

  const [borderWidth, setBorderWidth] =
    useState<keyof React.CSSProperties>("borderWidth");
  const [borderStyle, setBorderStyle] =
    useState<keyof React.CSSProperties>("borderStyle");
  const [borderColor, setBorderColor] =
    useState<keyof React.CSSProperties>("borderColor");
  const [activeBorderType, setActiveBorderType] = useState<string>("");

  useEffect(() => {
    console.log(borderWidth);
    console.log(borderStyle);
    console.log(borderColor);
  }, [borderWidth, borderStyle, borderColor]);

  const setBorderType = (value: string) => {
    setActiveBorderType(value);
    setBorderWidth(`border${value}Width` as keyof React.CSSProperties);
    setBorderStyle(`border${value}Style` as keyof React.CSSProperties);
    setBorderColor(`border${value}Color` as keyof React.CSSProperties);
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
        <div style={styles.header}>Border</div>
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
            <BR />
          </div>
          <div>
            <SizeInputWithUnits
              styleItem="borderRadius"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue="0"
            />
          </div>
        </div>

        <div style={styles.borderGrid}>
          <span>&nbsp;</span>
          <span
            onClick={(e) => {
              setBorderType("Top");
            }}
            style={
              activeBorderType === "Top"
                ? { ...styles.borderOption, backgroundColor: gray800 }
                : { ...styles.borderOption }
            }
          >
            T
          </span>
          <span>&nbsp;</span>
          <span
            onClick={(e) => {
              setBorderType("Left");
            }}
            style={
              activeBorderType === "Left"
                ? { ...styles.borderOption, backgroundColor: gray800 }
                : { ...styles.borderOption }
            }
          >
            L
          </span>
          <span
            onClick={(e) => {
              setBorderType("");
            }}
            style={
              activeBorderType === ""
                ? { ...styles.borderOption, backgroundColor: gray800 }
                : { ...styles.borderOption }
            }
          >
            A
          </span>
          <span
            onClick={(e) => {
              setBorderType("Right");
            }}
            style={
              activeBorderType === "Right"
                ? { ...styles.borderOption, backgroundColor: gray800 }
                : { ...styles.borderOption }
            }
          >
            R
          </span>
          <span>&nbsp;</span>
          <span
            onClick={(e) => {
              setBorderType("Bottom");
            }}
            style={
              activeBorderType === "Bottom"
                ? { ...styles.borderOption, backgroundColor: gray800 }
                : { ...styles.borderOption }
            }
          >
            B
          </span>
          <span>&nbsp;</span>
        </div>

        <div style={styles.gridContainer}>
          <div style={styles.optionName}>
            <BW />
          </div>
          <div>
            <SizeInputWithUnits
              styleItem={borderWidth}
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue=""
            />
          </div>

          <div style={styles.optionName}>
            <BS />
          </div>
          <div style={{ marginLeft: "-2px" }}>
            <select
              name="Border Style"
              onChange={(e) => handleBorderChange(e, borderStyle)}
              style={styles.inputBox}
              value={props.styles[borderStyle] || ""}
            >
              <option style={styles.select} value={""}></option>
              <option style={styles.select} value="none">
                none
              </option>
              <option style={styles.select} value="solid">
                solid
              </option>
              <option style={styles.select} value="dashed">
                dashed
              </option>
              <option style={styles.select} value="dotted">
                dotted
              </option>
            </select>
          </div>
        </div>
        <div style={styles.gridInputContainer}>
          <div style={styles.optionName}>
            <BC />
          </div>
          <ColorComponent
            name="Border Color"
            styleItem={borderColor}
            styles={props.styles}
            patchCb={props.patchCb}
            openPalette={props.openPalette}
          />
        </div>
      </div>
    </div>
  );
};
