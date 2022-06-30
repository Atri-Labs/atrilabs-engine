import {
  gray100,
  gray200,
  gray400,
  gray800,
  smallText,
  h5Heading,
} from "@atrilabs/design-system";
import React, { useState } from "react";
import { ReactComponent as BC } from "../../assets/border/border-color-icon.svg";
import { ReactComponent as BR } from "../../assets/border/border-radius-icon.svg";
import { ReactComponent as BS } from "../../assets/border/border-style-icon.svg";
import { ReactComponent as BW } from "../../assets/border/border-width-icon.svg";
import { ReactComponent as DropDownArrow } from "../../assets/layout-parent/dropdown-icon.svg";

import { CssProprtyComponentType } from "../../types";

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
    textAlign: "right",
    color: gray100,
    padding: "4px",
    backgroundColor: gray800,
    width: "45px",
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
    marginBottom: "15px",
  },
  optionName: {
    ...smallText,
    width: "1.5rem",
    color: "white",
    display: "flex",
    alignItems: "center",
  },
  optionsIcons: {
    flexGrow: 1,
  },
};

export const Border: React.FC<CssProprtyComponentType> = (props) => {
  const [showProperties, setShowProperties] = useState(true);

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
      <div style={showProperties ? { display: "block" } : { display: "none" }}>
        <div style={styles.option}>
          <div style={styles.optionName}>
            <BR />
          </div>
          <div style={styles.rectLabel}>
            <input
              type="text"
              style={{ ...styles.inputBox, marginRight: "50px" }}
              placeholder="PX"
            />
            <div style={styles.optionName}>
              <BW />
            </div>
            <input type="text" style={styles.inputBox} placeholder="PX" />
          </div>
        </div>
        <div style={styles.option}>
          <div style={styles.optionName}>
            <BS />
          </div>
          <div style={styles.rectLabel}>
            <input
              type="text"
              style={{ ...styles.inputBox, marginRight: "50px" }}
              placeholder="PX"
            />
            <div style={styles.optionName}>
              <BC />
            </div>
            <input type="text" style={styles.inputBox} />
          </div>
        </div>
      </div>
    </div>
  );
};
