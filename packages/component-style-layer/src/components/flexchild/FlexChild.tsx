import {
  gray200,
  gray400,
  gray800,
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
import { FlexChildInput } from "../commons/FlexChildInput";

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
  drop: {
    display: "flex",
    alignItems: "baseline",
    cursor: "pointer",
  },
  optionName: {
    ...smallText,
    color: "white",
    textAlign: "left",
    lineHeight: "25px",
  },
  gridContainer: {
    ...smallText,
    color: gray400,
    display: "grid",
    gridTemplateColumns: "3rem 30px 30px 30px",
    columnGap: "20px",
    rowGap: "3px",
    textAlign: "center",
  },
};

// CSS Values for different CSS property (The default value must be at position 0)
// CSS values for flex-direction CSS property (The default value row is at position 0)
const alignSelfValues = [
  "auto",
  "flex-start",
  "center",
  "flex-end",
  "stretch",
  "baseline",
];

// This serves as a Semi-Smart component, i.e. it uses useMemo but not useState or useRef.
export const FlexChild: React.FC<CssProprtyComponentType> = (props) => {
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
        <div style={styles.header}>Flex Child</div>
      </div>
      <div
        style={
          showProperties
            ? { display: "flex", rowGap: "1rem", flexDirection: "column" }
            : { display: "none" }
        }
      >
        <PropertyRender
          styleItem="alignSelf"
          styleText="Align"
          styleArray={alignSelfValues}
          styles={props.styles}
          patchCb={props.patchCb}
        >
          <FCAAuto />
          <FCAFlexStart />
          <FCAFlexCenter />
          <FCAFlexEnd />
          <FCAFlexStretch />
          <FCAFlexBaseline />
        </PropertyRender>

        <div style={styles.gridContainer}>
          <div>&nbsp;</div>
          <div>Grow</div>
          <div>Shrink</div>
          <div>Order</div>
          <div style={styles.optionName}>Override</div>
          <div>
            <FlexChildInput
              styleItem="flexGrow"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue="0"
            />
          </div>
          <div>
            <FlexChildInput
              styleItem="flexShrink"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue="1"
            />
          </div>
          <div>
            <FlexChildInput
              styleItem="order"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
