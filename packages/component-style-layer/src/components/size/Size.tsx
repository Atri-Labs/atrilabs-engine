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
    textAlign: "right",
    color: gray100,
    padding: "3px",
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
    width: "4rem",
    color: "white",
    display: "flex",
    alignItems: "center",
  },
  optionsIcons: {
    flexGrow: 1,
  },
};

export const Size: React.FC<CssProprtyComponentType> = (props) => {
  const [showProperties, setshowProperties] = useState(true);

  return (
    <div style={styles.container}>
      <div style={styles.drop}>
        <DropDownArrow
          onClick={() => setshowProperties(!showProperties)}
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
            <div style={{ marginRight: "17px" }}>
              <input type="text" style={styles.inputBox} placeholder="PX" />
            </div>
            <div style={{ marginRight: "17px" }}>
              <label style={styles.inputLabel}>Min</label>
              <input type="text" style={styles.inputBox} placeholder="PX" />
            </div>
            <div>
              <label style={styles.inputLabel}>Max</label>
              <input type="text" style={styles.inputBox} placeholder="PX" />
            </div>
          </div>
        </div>
        <div style={styles.option}>
          <div style={styles.optionName}>H</div>
          <div style={styles.rectLabel}>
            <div style={{ marginRight: "17px" }}>
              <input type="text" style={styles.inputBox} placeholder="PX" />
            </div>
            <div style={{ marginRight: "17px" }}>
              <input type="text" style={styles.inputBox} placeholder="PX" />
            </div>
            <div>
              <input type="text" style={styles.inputBox} placeholder="PX" />
            </div>
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
