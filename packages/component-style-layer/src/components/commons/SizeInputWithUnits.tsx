import { gray100, gray400, gray800, smallText } from "@atrilabs/design-system";
import React, { useState } from "react";
import { CssProprtyComponentType } from "../../types";

export type SizeInputWithUnitsProps = {
  styleItem: keyof React.CSSProperties;
  patchCb: CssProprtyComponentType["patchCb"];
  styles: CssProprtyComponentType["styles"];
  defaultValue: string;
  placeHolderText: string;
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
  },
  inputBox: {
    ...smallText,
    outline: "none",
    color: gray100,
    padding: "3px",
    backgroundColor: gray800,
    width: "25px",
    border: "none",
    borderRadius: "2px 0 0 2px",
    lineHeight: "20px",
  },
  inputSpan: {
    ...smallText,
    color: gray400,
    backgroundColor: gray800,
    borderRadius: "0 2px 2px 0",
    display: "flex",
    alignItems: "center",
    paddingRight: "4px",
    width: "25px",
    outline: "none",
    border: "none",
  },
};

export const SizeInputWithUnits: React.FC<SizeInputWithUnitsProps> = (
  props
) => {
  const getDigitIndex = (value: any) => {
    let digitIndex;
    value = String(value);
    console.log(value);
    for (let i = 0; i < value.length; i++) {
      if ((value[i] >= "a" && value[i] <= "z") || value[i] === "%") {
        digitIndex = i;
        break;
      }
    }
    return digitIndex;
  };

  const getNumericValue = (value: any) => {
    let digitIndex = getDigitIndex(value);
    return value.substring(0, digitIndex);
  };
  const getUnitIndex = (value: any) => {
    let digitIndex = getDigitIndex(value);
    console.log(value.substring(digitIndex, value.length));
    return value.substring(digitIndex, value.length - 1);
  };

  const [unit, setUnit] = useState(getUnitIndex(props.styles[props.styleItem]));

  const parseValueUnit = (e: string, unit: string) => {
    return e.concat(unit);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    styleItem: keyof React.CSSProperties
  ) => {
    props.patchCb({
      property: {
        styles: {
          [styleItem]:
            unit === "auto" ? "auto" : parseValueUnit(e.target.value, unit),
        },
      },
    });
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUnit(e.target.value);
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        value={
          (props.styles[props.styleItem] &&
            getNumericValue(props.styles[props.styleItem])) ||
          ""
        }
        onChange={(e) => handleChange(e, props.styleItem)}
        style={styles.inputBox}
        placeholder={props.defaultValue}
        // disabled={props.styles[props.styleItem] === "auto" ? false : false}
        pattern="^[0-9]+$"
      />
      <select
        style={styles.inputSpan}
        value={unit}
        onChange={(e) => handleUnitChange(e)}
      >
        <option value="px">PX</option>
        <option value="%">%</option>
        <option value="em">EM</option>
        <option value="rem">REMM</option>
        <option value="ch">CH</option>
        <option value="vw">VW</option>
        <option value="vh">VH</option>
        <option value="auto">AUTO</option>
      </select>
    </div>
  );
};
