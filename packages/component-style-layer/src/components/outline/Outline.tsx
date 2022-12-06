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
import { ReactComponent as BS } from "../../assets/border/border-style-icon.svg";
import { ReactComponent as BW } from "../../assets/border/border-width-icon.svg";
import { ReactComponent as DropDownArrow } from "../../assets/layout-parent/dropdown-icon.svg";
import { CssProprtyComponentType } from "../../types";
import { ColorComponent } from "../commons/ColorComponent";
import { SizeInputWithUnits } from "../commons/SizeInputWithUnits";

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
  inputBox: {
    ...smallText,
    outline: "none",
    color: gray100,
    backgroundColor: gray800,
    width: "57px",
    height: "26px",
    border: "none",
    borderRadius: "2px",
  },
  drop: {
    display: "flex",
    alignItems: "baseline",
    cursor: "pointer",
  },
  optionName: {
    ...smallText,
    width: "1.5rem",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  select: {
    textAlign: "left",
  },
  gridContainer: {
    ...smallText,
    color: gray400,
    display: "grid",
    gridTemplateColumns: "15px 60px 15px 60px",
    rowGap: "1rem",
    textAlign: "center",
    columnGap: "1rem",
  },
  gridInputContainer: {
    ...smallText,
    color: gray400,
    display: "grid",
    gridTemplateColumns: "15px 60px 40px 40px",
    rowGap: "1rem",
    textAlign: "center",
    columnGap: "1rem",
  },
  inputContainer: {
    display: "flex",
  },
};

export const Outline: React.FC<CssProprtyComponentType> = (props) => {
  const [showProperties, setShowProperties] = useState(true);

  const handleOutlineChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    styleItem: keyof React.CSSProperties
  ) => {
    props.patchCb({
      property: {
        styles: {
          [styleItem]: e.target.value,
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
        <div style={styles.header}>Outline</div>
      </div>
      <div
        style={
          showProperties
            ? { display: "flex", rowGap: "1rem", flexDirection: "column" }
            : { display: "none" }
        }
      >
        <div style={styles.gridContainer}>
          <div style={styles.optionName}>
            <BW />
          </div>
          <div>
            <SizeInputWithUnits
              styleItem="outlineWidth"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue="1"
            />
          </div>
          <div style={styles.optionName}>
            <div style={{ ...smallText, color: gray200 }}>Offset</div>
          </div>
          <div>
            <SizeInputWithUnits
              styleItem="outlineOffset"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue="0"
            />
          </div>
          <div style={styles.optionName}>
            <BS />
          </div>
          <div style={{ marginLeft: "-2px" }}>
            <select
              name="outlineStyle"
              onChange={(e) => handleOutlineChange(e, "outlineStyle")}
              style={styles.inputBox}
              value={props.styles.outlineStyle || ""}
            >
              <option style={styles.select} value={""}></option>
              <option style={styles.select} value="dotted">
                dotted
              </option>
              <option style={styles.select} value="dashed">
                dashed
              </option>
              <option style={styles.select} value="solid">
                solid
              </option>
              <option style={styles.select} value="double">
                double
              </option>
              <option style={styles.select} value="groove">
                groove
              </option>
              <option style={styles.select} value="ridge">
                ridge
              </option>
              <option style={styles.select} value="inset">
                inset
              </option>
              <option style={styles.select} value="outset">
                outset
              </option>
              <option style={styles.select} value="none">
                none
              </option>
              <option style={styles.select} value="hidden">
                hidden
              </option>
            </select>
          </div>
        </div>
        <div style={styles.gridInputContainer}>
          <ColorComponent
            name="Outline Color"
            styleItem="outlineColor"
            styles={props.styles}
            patchCb={props.patchCb}
            openPalette={props.openPalette}
          />
        </div>
      </div>
    </div>
  );
};
