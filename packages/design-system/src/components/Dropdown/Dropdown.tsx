import React, { useState, useEffect } from "react";
import { gray300, gray800 } from "../../consts/colors";
import { smallText } from "../../consts/typography";
import styles from "../../stylesheets/form-field.module.css";

export type DropdownProps = {
  options: string[];
  onSelect: (option: string, index: number) => void;
  selectedIndex: number;
  disabled?: boolean;
};

// Controlled Component
export const Dropdown: React.FC<DropdownProps> = React.memo((props) => {
  return (
    <select
      style={{
        width: "10rem",
        height: "1.4rem",
        background: `${gray800}`,
        ...smallText,
        color: gray300,
        borderRadius: "4px",
        padding: "0.2rem",
      }}
      className={styles["formfield"]}
      onChange={(e) => {
        if (props.onSelect)
          props.onSelect(
            props.options[e.target.selectedIndex],
            e.target.selectedIndex
          );
      }}
      value={props.options[props.selectedIndex]}
      disabled={props.disabled}
    >
      {props.options.map((opt, index) => {
        return (
          <option value={opt} key={opt + index}>
            {opt}
          </option>
        );
      })}
    </select>
  );
});
