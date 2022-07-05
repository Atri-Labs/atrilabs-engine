import {
  gray200,
  smallText,
  h5Heading,
  gray100,
  gray800,
} from "@atrilabs/design-system";
import React, { useCallback, useState } from "react";
import { ReactComponent as DropDownArrow } from "../../assets/layout-parent/dropdown-icon.svg";
import { ReactComponent as LA } from "../../assets/typo/left-align.svg";
import { ReactComponent as RA } from "../../assets/typo/right-align.svg";
import { ReactComponent as CA } from "../../assets/typo/center-align.svg";
import { ReactComponent as JA } from "../../assets/typo/justify-align.svg";
import { ReactComponent as MH } from "../../assets/typo/more-horizontal.svg";

import { CssProprtyComponentType } from "../../types";
import PropertyRender from "../commons/PropertyRender";
import { SizeInput } from "../commons/SizeInput";
import { BorderInput } from "../commons/BorderInput";

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
    marginBottom: "15px",
    alignItems: "center",
  },
  optionName: {
    ...smallText,
    color: "white",
    width: "4rem",
  },
};

const textAlignValues = ["left", "right", "center", "justify"];
// CSS Values for different CSS property (The default value must be at position 0)
// CSS values for flex-direction CSS property (The default value row is at position 0)

// This serves as a Semi-Smart component, i.e. it uses useMemo but not useState or useRef.
export const Typography: React.FC<CssProprtyComponentType> = (props) => {
  const [showProperties, setShowProperties] = useState(true);

  function handleFontChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    fontItem: keyof React.CSSProperties
  ) {
    props.patchCb({
      property: {
        styles: {
          [fontItem]: parseInt(e.target.value),
        },
      },
    });
  }

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
      <div style={showProperties ? { display: "block" } : { display: "none" }}>
        <div style={styles.option}>
          <div style={styles.optionName}>Font</div>
          <div>
            <select
              name="fontFamily"
              onChange={(e) => handleFontChange(e, "fontFamily")}
              style={{ ...styles.inputBox, width: "145px" }}
            >
              <option style={styles.select} value="Inter">
                Inter
              </option>
              <option style={styles.select} value="Roboto">
                Roboto
              </option>
              <option style={styles.select} value="Lora">
                Lora
              </option>
              <option style={styles.select} value="Sans-serif">
                Sans-serif
              </option>
            </select>
          </div>
        </div>
        <div style={styles.option}>
          <div style={styles.optionName}>Weight</div>
          <select
            name="font"
            onChange={(e) => handleFontChange(e, "fontWeight")}
            style={{ ...styles.inputBox, width: "65px", marginRight: "20px" }}
          >
            <option style={styles.select} value={400}>
              Regular
            </option>
            <option style={styles.select} value={100}>
              Thin
            </option>
            <option style={styles.select} value={200}>
              ExtraLight
            </option>
            <option style={styles.select} value={300}>
              Light
            </option>
            <option style={styles.select} value={500}>
              Medium
            </option>
            <option style={styles.select} value={600}>
              SemiBold
            </option>
            <option style={styles.select} value={700}>
              Bold
            </option>
            <option style={styles.select} value={800}>
              ExtraBold
            </option>
            <option style={styles.select} value={900}>
              Black
            </option>
          </select>
          <div style={{ width: "45px", lineHeight: "35px" }}>
            <SizeInput
              styleItem="fontSize"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue=""
              placeHolderText="PX"
            />
          </div>
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
          <div style={{ width: "55px", marginRight: "10px" }}>
            <BorderInput
              styleItem="color"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue=""
            />
          </div>
          <div style={{ width: "45px", marginRight: "10px" }}>
            <SizeInput
              styleItem="opacity"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue=""
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
