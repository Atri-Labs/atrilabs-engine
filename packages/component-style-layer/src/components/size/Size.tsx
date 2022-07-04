import {
  gray200,
  gray400,
  smallText,
  h5Heading,
  gray800,
  gray100,
} from "@atrilabs/design-system";
import React, { useState } from "react";
import { ReactComponent as OFA } from "../../assets/size/Auto.svg";
import { ReactComponent as OFH } from "../../assets/size/overflow-hidden.svg";
import { ReactComponent as OFS } from "../../assets/size/overflow-scroll.svg";
import { ReactComponent as OFV } from "../../assets/size/overflow-visible.svg";
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
    outline: "none",
    color: gray100,
    padding: "3px",
    backgroundColor: gray800,
    width: "25px",
    height: "20px",
    border: "0px",
    borderRadius: "2px 0 0 2px",
  },
  rectLabel: {
    ...smallText,
    color: gray400,
    display: "flex",
    textAlign: "center",
    lineHeight: "0px",
  },
  inputSpan: {
    ...smallText,
    color: gray400,
    padding: "6px 8px 0 0",
    backgroundColor: gray800,
    width: "10px",
    height: "20px",
    border: "0px",
    borderRadius: "0 2px 2px 0",
  },
  inputLabel: {
    position: "relative",
    top: "-10px",
    right: "-34px",
  },
  drop: {
    display: "flex",
    alignItems: "baseline",
  },
  option: {
    display: "flex",
    height: "25px",
    marginBottom: "15px",
  },
  optionName: {
    ...smallText,
    width: "1.35rem",
    color: "white",
    display: "flex",
    alignItems: "center",
  },
  optionsIcons: {
    flexGrow: 1,
  },
};

export const Size: React.FC<CssProprtyComponentType> = (props) => {
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
        <div style={styles.header}>Size</div>
      </div>
      <div style={showProperties ? { display: "block" } : { display: "none" }}>
        <div style={styles.option}>
          <div style={styles.optionName}>W</div>
          <div style={styles.rectLabel}>
            <input
              type="text"
              value={props.styles.width || ''}
              onChange={(e) => handleChange(e, "width")}
              style={styles.inputBox}
            />
            <span style={styles.inputSpan}>PX</span>
            <label style={styles.inputLabel}>Min</label>
            <input
              type="text"
              value={props.styles.minWidth || ''}
              onChange={(e) => handleChange(e, "minWidth")}
              style={styles.inputBox}
            />
            <span style={styles.inputSpan}>PX</span>
            <label style={styles.inputLabel}>Max</label>
            <input
              type="text"
              value={props.styles.maxWidth || ''}
              onChange={(e) => handleChange(e, "maxWidth")}
              style={styles.inputBox}
            />
            <span style={styles.inputSpan}>PX</span>
          </div>
        </div>
        <div style={styles.option}>
          <div style={styles.optionName}>H</div>
          <div style={styles.rectLabel}>
            <input
              type="text"
              value={props.styles.height || ''}
              onChange={(e) => handleChange(e, "height")}
              style={styles.inputBox}
            />
            <span style={{ ...styles.inputSpan, marginRight: "18px" }}>PX</span>
            <input
              type="text"
              value={props.styles.minHeight || ''}
              onChange={(e) => handleChange(e, "minHeight")}
              style={styles.inputBox}
            />
            <span style={{ ...styles.inputSpan, marginRight: "18.5px" }}>
              PX
            </span>
            <input
              type="text"
              value={props.styles.maxHeight || ''}
              onChange={(e) => handleChange(e, "maxHeight")}
              style={styles.inputBox}
            />
            <span style={styles.inputSpan}>PX</span>
          </div>
        </div>

        <PropertyRender
          {...{
            styleItem: "overflow",
            styleText: "Overflow",
            styleArray: ["visible", "scroll", "hidden", "auto"],
            patchCb: props.patchCb,
            styles: props.styles,
          }}
        >
          <OFV />
          <OFS />
          <OFH />
          <OFA />
        </PropertyRender>
      </div>
    </div>
  );
};
