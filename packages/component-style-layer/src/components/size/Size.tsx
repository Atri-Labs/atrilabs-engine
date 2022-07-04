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
import { SizeInput } from "../commons/SizeInput";

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
  rectLabel: {
    ...smallText,
    color: gray400,
    display: "flex",
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

const overflowValues = ["visible", "scroll", "hidden", "auto"];

export const Size: React.FC<CssProprtyComponentType> = (props) => {
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
        <div style={styles.header}>Size</div>
      </div>
      <div style={showProperties ? { display: "block" } : { display: "none" }}>
        <div style={styles.option}>
          <div style={styles.optionName}>W</div>
          <div style={styles.rectLabel}>
            <SizeInput
              styleItem="width"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue=""
            />
            <label style={styles.inputLabel}>Min</label>
            <SizeInput
              styleItem="minWidth"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue=""
            />
            <label style={styles.inputLabel}>Max</label>
            <SizeInput
              styleItem="maxWidth"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue=""
            />
          </div>
        </div>
        <div style={styles.option}>
          <div style={styles.optionName}>H</div>
          <div style={styles.rectLabel}>
            <SizeInput
              styleItem="height"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue=""
            />
            <SizeInput
              styleItem="minHeight"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue=""
            />
            <SizeInput
              styleItem="maxHeight"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue=""
            />
          </div>
        </div>

        <PropertyRender
          styleItem="overflow"
          styleText="Overflow"
          styleArray={overflowValues}
          patchCb={props.patchCb}
          styles={props.styles}
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
