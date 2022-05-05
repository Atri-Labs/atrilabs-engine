import React, { useState } from "react";
import { gray300, gray800 } from "../../consts/colors";
import { smallText } from "../../consts/typography";
import styles from "../../stylesheets/form-field.module.css";

export type DropdownProps = {
  options: string[];
  onSelect?: (option: string, index: number) => void;
  initialSelectedIndex?: number;
};

export const Dropdown: React.FC<DropdownProps> = React.memo((props) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(
    props.initialSelectedIndex || 0
  );
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
        setSelectedIndex(e.target.selectedIndex);
        if (props.onSelect)
          props.onSelect(
            props.options[e.target.selectedIndex],
            e.target.selectedIndex
          );
      }}
    >
      {props.options.map((opt, index) => {
        return (
          <option selected={selectedIndex === index} value={opt}>
            {opt}
          </option>
        );
      })}
    </select>
  );
});
