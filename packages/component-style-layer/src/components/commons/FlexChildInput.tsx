import React from "react";
import { CssProprtyComponentType } from "../../types";
import ControlledInput from "./ControlledInput";

export type FlexChildInputProps = {
  styleItem: keyof React.CSSProperties;
  patchCb: CssProprtyComponentType["patchCb"];
  styles: CssProprtyComponentType["styles"];
  defaultValue: string | number;
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
