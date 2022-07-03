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

import { CssProprtyComponentType } from "../../types";

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
    outline: "none",
    textAlign: "left",
    color: gray100,
    padding: "3px",
    backgroundColor: gray800,
    width: "30px",
    height: "20px",
    border: "0px",
    borderRadius: "2px 0 0 2px",
  },
  rectLabel: {
    ...smallText,
    color: gray400,
    display: "flex",
    textAlign: "center",
    lineHeight: "0px",
  },
  inputSpan: {
    ...smallText,
    color: gray400,
    padding: "6px 8px 0 0",
    backgroundColor: gray800,
    width: "10px",
    height: "20px",
    border: "0px",
    borderRadius: "0 2px 2px 0",
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
    width: "1.5rem",
    color: "white",
    display: "flex",
    alignItems: "center",
  },
  optionsIcons: {
    flexGrow: 1,
  },
  select: {
    textAlign: "left",
    height: "50px",
  },
};

export const Border: React.FC<CssProprtyComponentType> = (props) => {
  const [showProperties, setShowProperties] = useState(true);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    styleItem: keyof React.CSSProperties
  ) => {
    props.patchCb({
      property: {
        styles: {
          [styleItem]: parseInt(e.target.value),
        },
      },
    });
  };

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
        <div style={styles.option}>
          <div style={styles.optionName}>
            <BR />
          </div>
          <div style={styles.rectLabel}>
            <input
              type="text"
              value={props.styles.borderRadius || ''}
              onChange={(e) => handleChange(e, "borderRadius")}
              style={styles.inputBox}
            />
            <span style={{ ...styles.inputSpan, marginRight: "30px" }}>PX</span>
            <div style={styles.optionName}>
              <BW />
            </div>
            <input
              type="text"
              value={props.styles.borderWidth || ''}
              onChange={(e) => handleChange(e, "borderWidth")}
              style={styles.inputBox}
            />
            <span style={styles.inputSpan}>PX</span>
          </div>
        </div>
        <div style={styles.option}>
          <div style={styles.optionName}>
            <BS />
          </div>
          <div style={styles.rectLabel}>
            <select
              name="borderStyle"
              onChange={(e) => handleBorderChange(e, "borderStyle")}
              style={{
                ...styles.inputBox,
                marginRight: "28px",
                borderRadius: "2px",
                width: "55px",
                height: "27px",
              }}
            >
              <option style={styles.select} value="solid">
                Solid
              </option>
              <option style={styles.select} value="none">
                None
              </option>
              <option style={styles.select} value="dashed">
                Dash
              </option>
              <option style={styles.select} value="dotted">
                Dot
              </option>
            </select>
            <div style={styles.optionName}>
              <BC />
            </div>
            <input
              type="text"
              value={props.styles.borderColor || ''}
              onChange={(e) => handleBorderChange(e, "borderColor")}
              style={{ ...styles.inputBox, width: "50px", borderRadius: "2px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
