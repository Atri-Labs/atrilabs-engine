import { CssProprtyComponentType } from "../../types";
import { ReactComponent as DropDownArrow } from "../../assets/layout-parent/dropdown-icon.svg";
import {
  gray200,
  gray400,
  smallText,
  h5Heading,
} from "@atrilabs/design-system";
import { useState } from "react";

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
  drop: {
    display: "flex",
    alignItems: "baseline",
  },
  option: {
    display: "flex",
    height: "25px",
    marginTop: "30px",
  },
  optionName: {
    ...smallText,
    textAlign: "left",
    color: "white",
    lineHeight: "25px",
  },
  gridContainer: {
    ...smallText,
    color: gray400,
    display: "grid",
    gridTemplateColumns: "2.5rem 50px 50px",
    textAlign: "center",
    columnGap: "25px",
    rowGap: "3px",
  },
};

export const Css2Display: React.FC<CssProprtyComponentType> = (props) => {
  const [showProperties, setShowProperties] = useState(true);

  const handleDropdownChange = (
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
        <div style={styles.header}>Layout</div>
      </div>
      <div
        style={
          showProperties
            ? { display: "flex", rowGap: "1rem", flexDirection: "column" }
            : { display: "none" }
        }
      ></div>
      <div style={showProperties ? { display: "block" } : { display: "none" }}>
        <div style={{ display: "flex" }}>
          <div style={styles.optionName}>Display</div>
          <select
            name="display"
            onChange={(e) => handleDropdownChange(e, "display")}
            style={styles.inputBox}
            value={props.styles.display || ""}
          >
            <option style={styles.select} value=""></option>
            <option style={styles.select} value="block">
              block
            </option>
            <option style={styles.select} value="inline-block">
              inline-block
            </option>
            <option style={styles.select} value="inline">
              inline
            </option>
            <option style={styles.select} value="contents">
              contents
            </option>
            <option style={styles.select} value="inline-table">
              inline-table
            </option>
            <option style={styles.select} value="list-item">
              list-item
            </option>
            <option style={styles.select} value="run-in">
              run-in
            </option>
            <option style={styles.select} value="table">
              table
            </option>
            <option style={styles.select} value="table-caption">
              table-caption
            </option>
            <option style={styles.select} value="table-column-group">
              table-column-group
            </option>
            <option style={styles.select} value="table-header-group">
              table-header-group
            </option>
            <option style={styles.select} value="table-footer-group">
              table-footer-group
            </option>
            <option style={styles.select} value="table-row-group">
              table-row-group
            </option>
            <option style={styles.select} value="table-cell">
              table-cell
            </option>
            <option style={styles.select} value="table-column">
              table-column
            </option>
            <option style={styles.select} value="table-row">
              table-row
            </option>
            <option style={styles.select} value="none">
              none
            </option>
            <option style={styles.select} value="initial">
              initial
            </option>
            <option style={styles.select} value="inherit">
              inherit
            </option>
          </select>
        </div>
        <div style={{ display: "flex" }}>
          <div style={styles.optionName}>Visibility</div>
          <select
            name="visibility"
            onChange={(e) => handleDropdownChange(e, "visibility")}
            style={styles.inputBox}
            value={props.styles.visibility || "visible"}
          >
            <option style={styles.select} value="visible">
              visible
            </option>
            <option style={styles.select} value="hidden">
              hidden
            </option>
            <option style={styles.select} value="collapse">
              collapse
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
  );
};
