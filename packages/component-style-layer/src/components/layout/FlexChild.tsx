import { gray200, gray400, smallText, h5Heading } from "@atrilabs/design-system";
import React, { useState } from "react";
import { ReactComponent as FCAAuto } from "../../assets/fc-align/fca-auto.svg";
import { ReactComponent as FCAFlexStart } from "../../assets/fc-align/fca-flex-start-icon.svg";
import { ReactComponent as FCAFlexEnd } from "../../assets/fc-align/fca-flex-end-icon.svg";
import { ReactComponent as FCAFlexCenter } from "../../assets/fc-align/fca-flex-center-icon.svg";
import { ReactComponent as FCAFlexStretch } from "../../assets/fc-align/fca-stretch-icon.svg";
import { ReactComponent as FCAFlexBaseline } from "../../assets/fc-align/fca-baseline-icon.svg";
import { ReactComponent as DropDownArrow } from "../../assets/dropdown-icon.svg";
import { ReactComponent as Rectangle } from "../../assets/layout-parent/Rectangle-714.svg";

import { CssProprtyComponentType } from "../../types";
import PropertyRender from "./PropertyRender";

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
    paddingBottom: "0.5rem",
    marginTop:"5px",
    height: "25px",
    paddingLeft: "0.5rem",
    userSelect: "none",
  },
  rectLabel: {
    ...smallText,
    color: gray400,
    display: "flex",
    textAlign: "center",
    lineHeight: "0px",
  },
  label: {
    marginTop: "0px",
    marginBottom: "10px",
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

// CSS Values for different CSS property (The default value must be at position 0)
// CSS values for flex-direction CSS property (The default value row is at position 0)

// This serves as a Semi-Smart component, i.e. it uses useMemo but not useState or useRef.
export const FlexChild: React.FC<CssProprtyComponentType> = (props) => {
  const [dis2, setDis2] = useState(true);

  return (
    <div style={styles.container}>
      <div style={styles.drop}>
        <DropDownArrow
          onClick={() => setDis2(!dis2)}
          style={
            !dis2
              ? { transform: "rotate(-90deg)" }
              : { transform: "rotate(0deg)" }
          }
        />
        <div style={styles.header}>Flex Child</div>
      </div>
      <div style={dis2 ? { display: "block" } : { display: "none" }}>
        <PropertyRender
          styles={{
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
          <div style={{ ...styles.optionName, marginTop: "12px" }}>
            Override
          </div>
          <div style={styles.rectLabel}>
            <div style={{ marginRight: "22px" }}>
              <p style={styles.label}>Grow</p>
              <Rectangle style={styles.rect} />
            </div>
            <div style={{ marginRight: "22px" }}>
              <p style={styles.label}>Shrink</p>
              <Rectangle style={styles.rect} />
            </div>
            <div>
              <p style={styles.label}>Order</p>
              <Rectangle style={styles.rect} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
