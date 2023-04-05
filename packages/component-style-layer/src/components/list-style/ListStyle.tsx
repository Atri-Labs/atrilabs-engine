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

//import { StaticAsset } from "../../../../custom-props-layer/src/components/static-asset/StaticAsset";

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

export const ListStyle: React.FC<CssProprtyComponentType> = (props) => {
  const [showProperties, setShowProperties] = useState(true);
  const handlelistStyleChange = (
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
        <div style={styles.header}>List Style</div>
      </div>
      <div
        style={
          showProperties
            ? { display: "flex", rowGap: "1rem", flexDirection: "column" }
            : { display: "none" }
        }
      >
        <div style={{ display: "flex" }}>
          <div style={styles.optionName}>Position</div>
          <div>
            <select
              name="listStylePosition"
              onChange={(e) => handlelistStyleChange(e, "listStylePosition")}
              style={styles.inputBox}
              value={props.styles.listStylePosition || undefined}
            >
              <option style={styles.select} value="outside">
                outside
              </option>
              <option style={styles.select} value="inside">
                inside
              </option>
            </select>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div style={styles.optionName}>Type</div>
          <div>
            <select
              name="listStyleType"
              onChange={(e) => handlelistStyleChange(e, "listStyleType")}
              style={styles.inputBox}
              value={props.styles.listStyleType || undefined}
            >
              <option style={styles.select} value="none">
                none
              </option>
              <option style={styles.select} value="disc">
                disc
              </option>
              <option style={styles.select} value="circle">
                circle
              </option>
              <option style={styles.select} value="square">
                square
              </option>
              <option style={styles.select} value="decimal">
                decimal
              </option>
              <option style={styles.select} value="decimal-leading-zero">
                decimal-leading-zero
              </option>
              <option style={styles.select} value="lower-roman">
                lower-roman
              </option>
              <option style={styles.select} value="upper-roman">
                upper-roman
              </option>
              <option style={styles.select} value="lower-alpha">
                lower-alpha
              </option>
              <option style={styles.select} value="upper-alpha">
                upper-alpha
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
