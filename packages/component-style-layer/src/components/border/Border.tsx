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
import "./ColorPalette.css";
import { CssProprtyComponentType } from "../../types";
import { SizeInput } from "../commons/SizeInput";
import { BorderInput } from "../commons/BorderInput";
import { ColorPickerAsset } from "../commons/ColorPickerAsset";
import { Cross } from "../../icons/Cross";

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
    height: "25px",
    paddingLeft: "0.5rem",
    userSelect: "none",
  },
  inputBox: {
    ...smallText,
    outline: "none",
    color: gray100,
    backgroundColor: gray800,
    width: "57px",
    height: "25px",
    border: "none",
    borderRadius: "2px",
  },
  drop: {
    display: "flex",
    alignItems: "baseline",
  },
  optionName: {
    ...smallText,
    width: "1.5rem",
    color: "white",
    lineHeight: "25px",
  },
  select: {
    textAlign: "left",
  },
  gridContainer: {
    ...smallText,
    color: gray400,
    display: "grid",
    gridTemplateColumns: "15px 60px 15px 60px",
    rowGap: "20px",
    textAlign: "center",
    columnGap: "15px",
    marginBottom: "25px",
  },
};

export const Border: React.FC<CssProprtyComponentType> = (props) => {
  const [showProperties, setShowProperties] = useState(true);
  const [showCp, setShowCp] = useState(false);

  const handleBorderChange = (
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
        <div style={styles.header}>Border</div>
      </div>
      <div style={showProperties ? { display: "block" } : { display: "none" }}>
        <div style={styles.gridContainer}>
          <div style={styles.optionName}>
            <BR />
          </div>
          <div>
            <SizeInput
              styleItem="borderRadius"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue=""
              placeHolderText="PX"
            />
          </div>
          <div style={styles.optionName}>
            <BW />
          </div>
          <div>
            <SizeInput
              styleItem="borderWidth"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue=""
              placeHolderText="PX"
            />
          </div>
          <div style={styles.optionName}>
            <BS />
          </div>
          <div>
            <select
              name="borderStyle"
              onChange={(e) => handleBorderChange(e, "borderStyle")}
              style={styles.inputBox}
            >
              <option style={styles.select} value="none">
                None
              </option>
              <option style={styles.select} value="solid">
                Solid
              </option>
              <option style={styles.select} value="dashed">
                Dash
              </option>
              <option style={styles.select} value="dotted">
                Dot
              </option>
            </select>
          </div>
          <div style={styles.optionName}>
            <BC />
          </div>
          <div className="cp-holder">
            <div
              style={showCp ? { display: "block" } : { display: "none" }}
              className="colorPalette"
            >
              <div className="cpinfo">
                <p>Border Color</p>
                <span
                  onClick={() => {
                    setShowCp(!showCp);
                    console.log("hello");
                  }}
                >
                  <Cross />
                </span>
              </div>

              <ColorPickerAsset
                styleItem="borderColor"
                styles={props.styles}
                patchCb={props.patchCb}
              />
            </div>
            <div
              onClick={() => {
                setShowCp(true);
                console.log("hi");
              }}
            >
              <BorderInput
                styleItem="borderColor"
                styles={props.styles}
                patchCb={props.patchCb}
                defaultValue=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
