import {
  gray200,
  gray400,
  gray800,
  smallText,
  h5Heading,
} from "@atrilabs/design-system";
import React, { useState } from "react";
import { ReactComponent as OFA } from "../../assets/size/Auto.svg";
import { ReactComponent as OFH } from "../../assets/size/overflow-hidden.svg";
import { ReactComponent as OFS } from "../../assets/size/overflow-scroll.svg";
import { ReactComponent as OFV } from "../../assets/size/overflow-visible.svg";
import { ReactComponent as DropDownArrow } from "../../assets/layout-parent/dropdown-icon.svg";
import { CssProprtyComponentType } from "../../types";
import PropertyRender from "../commons/PropertyRender";
import { SizeInputWithUnits } from "../commons/SizeInputWithUnits";
import { ReactComponent as BCY } from "../../assets/background/content-box-icon.svg";
import { ReactComponent as BCO } from "../../assets/background/border-box-icon.svg";

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
  parentGridContainer: {
    ...smallText,
    color: gray400,
    display: "grid",
    gridTemplateRows: "15px 72px",
    textAlign: "center",
    rowGap: "0rem",
  },
  titleGridContainer: {
    ...smallText,
    color: gray400,
    display: "grid",
    gridTemplateColumns: "10px 50px 50px 50px",
    textAlign: "center",
    columnGap: "13px",
  },
  gridContainer: {
    ...smallText,
    color: gray400,
    display: "grid",
    gridTemplateColumns: "10px 50px 50px 50px",
    gridTemplateRows: "28px 28px",
    textAlign: "center",
    columnGap: "13px",
    rowGap: "1rem",
  },
  optionName: {
    ...smallText,
    color: gray200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
const overflowValues = ["visible", "scroll", "hidden", "auto"];
const boxSizingValues = ["content-box", "border-box", "initial", "inherit"];

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
      <div
        style={
          showProperties
            ? { display: "flex", rowGap: "1rem", flexDirection: "column" }
            : { display: "none" }
        }
      >
        <div
          style={{ display: "flex", rowGap: "1rem", flexDirection: "column" }}
        >
          <div style={styles.parentGridContainer}>
            <div style={styles.titleGridContainer}>
              <div>&nbsp;</div>
              <div>&nbsp;</div>
              <div>Min</div>
              <div>Max</div>
            </div>

            <div style={styles.gridContainer}>
              <div style={styles.optionName}>W</div>
              <div>
                <SizeInputWithUnits
                  styleItem="width"
                  styles={props.styles}
                  patchCb={props.patchCb}
                  defaultValue=""
                />
              </div>
              <div>
                <SizeInputWithUnits
                  styleItem="minWidth"
                  styles={props.styles}
                  patchCb={props.patchCb}
                  defaultValue=""
                />
              </div>
              <div>
                <SizeInputWithUnits
                  styleItem="maxWidth"
                  styles={props.styles}
                  patchCb={props.patchCb}
                  defaultValue=""
                />
              </div>
              <div style={styles.optionName}>H</div>
              <div>
                <SizeInputWithUnits
                  styleItem="height"
                  styles={props.styles}
                  patchCb={props.patchCb}
                  defaultValue=""
                />
              </div>
              <div>
                <SizeInputWithUnits
                  styleItem="minHeight"
                  styles={props.styles}
                  patchCb={props.patchCb}
                  defaultValue=""
                />
              </div>
              <div>
                <SizeInputWithUnits
                  styleItem="maxHeight"
                  styles={props.styles}
                  patchCb={props.patchCb}
                  defaultValue=""
                />
              </div>
            </div>
          </div>
          <div
            style={{ display: "flex", rowGap: "1rem", flexDirection: "column" }}
          >
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
            <PropertyRender
              styleItem="boxSizing"
              styleText="Box-Sizing"
              styleArray={boxSizingValues}
              patchCb={props.patchCb}
              styles={props.styles}
            >
              <BCY />
              <BCO />
              <div style={{ ...smallText, color: gray200, cursor: "pointer" }}>
                Initial
              </div>
              <div style={{ ...smallText, color: gray200, cursor: "pointer" }}>
                Inherit
              </div>
            </PropertyRender>
          </div>
        </div>
      </div>
    </div>
  );
};
