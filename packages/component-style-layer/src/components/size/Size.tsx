import {
  gray200,
  gray400,
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
import { SizeInput } from "../commons/SizeInput";
import { SizeInputWithUnits } from "../commons/SizeInputWithUnits";

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
    height: "15px",
    paddingLeft: "0.5rem",
    userSelect: "none",
  },
  drop: {
    display: "flex",
    alignItems: "baseline",
  },
  optionName: {
    ...smallText,
    color: "#FFFFFF",
    lineHeight: "25px",
  },
  gridContainer: {
    ...smallText,
    color: gray400,
    display: "grid",
    gridTemplateColumns: "10px 50px 50px 50px",
    gridTemplateRows: "15px 40px",
    textAlign: "center",
    columnGap: "16px",
    marginBottom: "20px",
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
        <div style={styles.gridContainer}>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>Min</div>
          <div>Max</div>
          <div style={styles.optionName}>W</div>
          <div>
            {/* <SizeInputWithUnits
                styleItem="width"
                styles={props.styles}
                patchCb={props.patchCb}
                defaultValue=""
                placeHolderText="PX"
              /> */}
          </div>
          <div>
            <SizeInput
              styleItem="minWidth"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue=""
              placeHolderText="PX"
            />
          </div>
          <div>
            <SizeInput
              styleItem="maxWidth"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue=""
              placeHolderText="PX"
            />
          </div>

          <div style={styles.optionName}>H</div>
          <div>
            <SizeInput
              styleItem="height"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue=""
              placeHolderText="PX"
            />
          </div>
          <div>
            <SizeInput
              styleItem="minHeight"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue=""
              placeHolderText="PX"
            />
          </div>
          <div>
            <SizeInput
              styleItem="maxHeight"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue=""
              placeHolderText="PX"
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
