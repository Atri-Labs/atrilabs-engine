import {
  gray100,
  gray800,
  gray200,
  gray400,
  smallText,
  h5Heading,
} from "@atrilabs/design-system";
import React, { useState } from "react";
import { ReactComponent as FCAAuto } from "../../assets/fc-align/fca-auto.svg";
import { ReactComponent as FCAFlexStart } from "../../assets/fc-align/fca-flex-start-icon.svg";
import { ReactComponent as FCAFlexEnd } from "../../assets/fc-align/fca-flex-end-icon.svg";
import { ReactComponent as FCAFlexCenter } from "../../assets/fc-align/fca-flex-center-icon.svg";
import { ReactComponent as FCAFlexStretch } from "../../assets/fc-align/fca-stretch-icon.svg";
import { ReactComponent as FCAFlexBaseline } from "../../assets/fc-align/fca-baseline-icon.svg";
import { ReactComponent as DropDownArrow } from "../../assets/layout-parent/dropdown-icon.svg";

import { CssProprtyComponentType } from "../../types";
import PropertyRender from "../commons/PropertyRender";

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
    marginTop: "5px",
    paddingBottom: "0.5rem",
    height: "25px",
    paddingLeft: "0.5rem",
    userSelect: "none",
  },
  inputBox: {
    ...smallText,
    textAlign: "center",
    color: gray100,
    padding: "3px",
    backgroundColor: gray800,
    width: "30px",
    height: "20px",
    border: "0px",
    borderRadius: "2px",
  },
  rectLabel: {
    ...smallText,
    color: gray400,
    display: "flex",
    textAlign: "center",
    lineHeight: "0px",
  },
  inputLabel: {
    position: "relative",
    textAlign: "center",
    top: "-10px",
  },
  drop: {
    display: "flex",
    alignItems: "baseline",
  },
  option: {
    display: "flex",
    height: "25px",
    marginTop: "30px",
    marginBottom: "15px",
  },
  optionName: {
    ...smallText,
    width: "4.5rem",
    color: "white",
    display: "flex",
    alignItems: "center",
  },
  optionsIcons: {
    flexGrow: 1,
  },
};

// CSS Values for different CSS property (The default value must be at position 0)
// CSS values for flex-direction CSS property (The default value row is at position 0)

// This serves as a Semi-Smart component, i.e. it uses useMemo but not useState or useRef.
export const FlexChild: React.FC<CssProprtyComponentType> = (props) => {
  const [showProperties, setShowProperties] = useState(true);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    styleItem: keyof React.CSSProperties
  ) => {
    props.patchCb({
      property: {
        styles: {
          [styleItem]: parseInt(e.target.value),
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
        <div style={styles.header}>Flex Child</div>
      </div>
      <div style={showProperties ? { display: "block" } : { display: "none" }}>
        <PropertyRender
          {...{
            styleItem: "alignSelf",
            styleText: "Align",
            styleArray: [
              "auto",
              "stretch",
              "flex-start",
              "center",
              "flex-end",
              "baseline",
            ],
            styles: props.styles,
            patchCb: props.patchCb,
          }}
        >
          <FCAAuto />
          <FCAFlexStart />
          <FCAFlexCenter />
          <FCAFlexEnd />
          <FCAFlexStretch />
          <FCAFlexBaseline />
        </PropertyRender>

        <div style={styles.option}>
          <div style={styles.optionName}>Override</div>
          <div style={styles.rectLabel}>
            <div style={{ marginRight: "10px" }}>
              <label style={styles.inputLabel}>Grow</label>
              <input
                type="text"
                value={props.styles.flexGrow}
                onChange={(e) => handleChange(e, "flexGrow")}
                style={styles.inputBox}
              />
            </div>
            <div style={{ marginRight: "10px" }}>
              <label style={styles.inputLabel}>Shrink</label>
              <input
                type="text"
                value={props.styles.flexShrink}
                onChange={(e) => handleChange(e, "flexShrink")}
                style={styles.inputBox}
              />
            </div>
            <div>
              <label style={styles.inputLabel}>Order</label>
              <input
                type="text"
                value={props.styles.flexBasis}
                onChange={(e) => handleChange(e, "flexBasis")}
                style={styles.inputBox}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
