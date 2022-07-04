import { gray100, gray800, smallText } from "@atrilabs/design-system";
import React from "react";
import { CssProprtyComponentType } from "../../types";

export type BorderInputProps = {
  styleItem: keyof React.CSSProperties;
  patchCb: CssProprtyComponentType["patchCb"];
  styles: CssProprtyComponentType["styles"];
  defaultValue: string;
};

const styles: { [key: string]: React.CSSProperties } = {
  inputBox: {
    ...smallText,
    outline: "none",
    color: gray100,
    padding: "3px",
    backgroundColor: gray800,
    width: "50px",
    border: "none",
    borderRadius: "2px",
    lineHeight: "20px",
  },
};

export const BorderInput: React.FC<BorderInputProps> = (props) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    styleItem: keyof React.CSSProperties
  ) => {
    if (props.styleItem !== "borderColor") {
      props.patchCb({
        property: {
          styles: {
            [styleItem]: parseInt(e.target.value),
          },
        },
      });
    } else {
      props.patchCb({
        property: {
          styles: {
            [styleItem]: e.target.value,
          },
        },
      });
    }
  };
  return (
    <div>
      <input
        type="text"
        value={props.styles[props.styleItem] || ""}
        onChange={(e) => handleChange(e, props.styleItem)}
        style={styles.inputBox}
      />
    </div>
  );
};
