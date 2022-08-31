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
              value={props.styles.cursor || "none"}
            >
              <option style={styles.select} value="default">
                default
              </option>
              <option style={styles.select} value="progress">
                progress
              </option>
              <option style={styles.select} value="pointer">
                pointer
              </option>
              <option style={styles.select} value="crosshair">
                crosshair
              </option>
              <option style={styles.select} value="auto">
                auto
              </option>
              <option style={styles.select} value="help">
                help
              </option>
              <option style={styles.select} value="move">
                move
              </option>
              <option style={styles.select} value="not-allowed">
                not-allowed
              </option>
              <option style={styles.select} value="zoom-in">
                zoom-in
              </option>
              <option style={styles.select} value="zoom-out">
                zoom-out
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
