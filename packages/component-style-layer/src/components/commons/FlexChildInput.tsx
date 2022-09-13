import { gray100, gray800, smallText } from "@atrilabs/design-system";
import React from "react";
import { CssProprtyComponentType } from "../../types";
import ControlledInput from "./ControlledInput";

export type FlexChildInputProps = {
  styleItem: keyof React.CSSProperties;
  patchCb: CssProprtyComponentType["patchCb"];
  styles: CssProprtyComponentType["styles"];
  defaultValue: string | number;
};

const styles: { [key: string]: React.CSSProperties } = {
  inputBox: {
    ...smallText,
    outline: "none",
    color: gray100,
    backgroundColor: gray800,
    width: "30px",
    border: "none",
    borderRadius: "2px",
    textAlign: "center",
    lineHeight: "25px",
  },
};

export const FlexChildInput: React.FC<FlexChildInputProps> = (props) => {
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
  return (
    <div>
      {/* <input
        type="text"
        value={props.styles[props.styleItem] || ""}
        onChange={(e) => handleChange(e, props.styleItem)}
        style={styles.inputBox}
        placeholder={
          typeof props.defaultValue === "number"
            ? props.defaultValue.toString()
            : props.defaultValue
        }
      /> */}
      <ControlledInput
        type="text"
        value={props.styles[props.styleItem] || ""}
        onChange={handleChange}
        styleItem={props.styleItem}
        disabled={""}
        placeholder={
          typeof props.defaultValue === "number"
            ? props.defaultValue.toString()
            : props.defaultValue
        }
        pattern="^[0-9]+$"
      />
    </div>
  );
};
