import {
  gray200,
  gray100,
  gray800,
  h5Heading,
  smallText,
} from "@atrilabs/design-system";
import React, { useState } from "react";
import { ReactComponent as DropDownArrow } from "../../assets/layout-parent/dropdown-icon.svg";
import { CssProprtyComponentType } from "../../types";
import "./Miscellaneous.css";

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
  inputBox: {
    ...smallText,
    outline: "none",
    color: gray100,
    backgroundColor: gray800,
    width: "77px",
    height: "26px",
    border: "none",
    borderRadius: "2px",
  },
  select: {
    textAlign: "left",
  },
  optionName: {
    ...smallText,
    width: "4rem",
    color: "white",
    height: "26px",
    display: "flex",
    alignItems: "center",
  },
};

export const Miscellaneous: React.FC<CssProprtyComponentType> = (props) => {
  const [showProperties, setShowProperties] = useState(true);
  const handleCursorChange = (
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
        <div style={styles.header}>Miscellaneous</div>
      </div>
      <div style={showProperties ? { display: "block" } : { display: "none" }}>
        <div style={{ display: "flex" }}>
          <div style={styles.optionName}>Cursor</div>
          <div>
            <select
              name="cursor"
              onChange={(e) => handleCursorChange(e, "cursor")}
              style={styles.inputBox}
              value={props.styles.cursor || "auto"}
              className="scroll"
            >
              <option style={styles.select} value="alias">
                alias
              </option>
              <option style={styles.select} value="all-scroll">
                all-scroll
              </option>
              <option style={styles.select} value="auto">
                auto
              </option>
              <option style={styles.select} value="cell">
                cell
              </option>
              <option style={styles.select} value="col-resize">
                col-resize
              </option>
              <option style={styles.select} value="copy">
                copy
              </option>
              <option style={styles.select} value="crosshair">
                crosshair
              </option>
              <option style={styles.select} value="default">
                default
              </option>
              <option style={styles.select} value="e-resize">
                e-resize
              </option>
              <option style={styles.select} value="ew-resize">
                ew-resize
              </option>
              <option style={styles.select} value="grab">
                grab
              </option>
              <option style={styles.select} value="grabbing">
                grabbing
              </option>
              <option style={styles.select} value="help">
                help
              </option>
              <option style={styles.select} value="move">
                move
              </option>
              <option style={styles.select} value="n-resize">
                n-resize
              </option>
              <option style={styles.select} value="ne-resize">
                ne-resize
              </option>
              <option style={styles.select} value="nesw-resize">
                nesw-resize
              </option>
              <option style={styles.select} value="ns-resize">
                ns-resize
              </option>
              <option style={styles.select} value="nw-resize">
                nw-resize
              </option>
              <option style={styles.select} value="nwse-resize">
                nwse-resize
              </option>
              <option style={styles.select} value="no-drop">
                no-drop
              </option>
              <option style={styles.select} value="none">
                none
              </option>
              <option style={styles.select} value="not-allowed">
                not-allowed
              </option>
              <option style={styles.select} value="pointer">
                pointer
              </option>
              <option style={styles.select} value="progress">
                progress
              </option>
              <option style={styles.select} value="row-resize">
                row-resize
              </option>
              <option style={styles.select} value="s-resize">
                s-resize
              </option>
              <option style={styles.select} value="se-resize">
                se-resize
              </option>
              <option style={styles.select} value="sw-resize">
                sw-resize
              </option>
              <option style={styles.select} value="text">
                text
              </option>
              <option style={styles.select} value="URL">
                URL
              </option>
              <option style={styles.select} value="vertical-text">
                vertical-text
              </option>
              <option style={styles.select} value="w-resize">
                w-resize
              </option>
              <option style={styles.select} value="wait">
                wait
              </option>
              <option style={styles.select} value="zoom-in">
                zoom-in
              </option>
              <option style={styles.select} value="zoom-out">
                zoom-out
              </option>
              <option style={styles.select} value="initial">
                initial
              </option>
              <option style={styles.select} value="inherit">
                inherit
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
