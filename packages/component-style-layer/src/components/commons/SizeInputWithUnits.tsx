import { gray100, gray800, smallText } from "@atrilabs/design-system";
import React, { useCallback, useMemo } from "react";
import { CssProprtyComponentType } from "../../types";
import ControlledInput from "./ControlledInput";
import "./SizeInputWithUnits.css";

export type SizeInputWithUnitsProps = {
  styleItem: keyof React.CSSProperties;
  patchCb: CssProprtyComponentType["patchCb"];
  styles: CssProprtyComponentType["styles"];
  defaultValue: string;
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
  },
  inputBox: {
    ...smallText,
    outline: "none",
    color: gray100,
    backgroundColor: gray800,
    height: "26px",
    width: "25px",
    border: "none",
    borderRadius: "2px 0 0 2px",
    paddingLeft: "6px",
  },
};

export const SizeInputWithUnits: React.FC<SizeInputWithUnitsProps> = (
  props
) => {
  const getDigitIndex = (value: string) => {
    let digitIndex;
    value = String(value);
    for (let i = 0; i < value.length; i++) {
      if ((value[i] >= "a" && value[i] <= "z") || value[i] === "%") {
        digitIndex = i;
        break;
      }
    }
    return digitIndex;
  };

  const getNumericValue = (value: string) => {
    let digitIndex = getDigitIndex(value);
    return value.substring(0, digitIndex);
  };

  const getUnitIndex = useCallback((value: string) => {
    let digitIndex = getDigitIndex(value) || 0;
    return value.substring(digitIndex, value.length);
  }, []);

  const unit = useMemo(() => {
    return getUnitIndex(String(props.styles[props.styleItem])) === "auto"
      ? ""
      : getUnitIndex(String(props.styles[props.styleItem] || "px"));
  }, [props.styles, props.styleItem, getUnitIndex]);

  const parseValueUnit = (e: string, unit: string) => {
    return e ? e.concat(unit) : "";
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

  const handleUnitChange = (
    unitValue: string,
    styleItem: keyof React.CSSProperties
  ) => {
    if (unitValue === "auto") {
      props.patchCb({
        property: {
          styles: {
            [styleItem]: "auto",
          },
        },
      });
    } else {
      let val = getNumericValue(String(props.styles[props.styleItem]));
      props.patchCb({
        property: {
          styles: {
            [styleItem]: val.concat(unitValue),
          },
        },
      });
    }
  };

  return (
    <div style={styles.container}>
      {/* <input
        type="text"
        value={
          props.styles[props.styleItem] !== "auto"
            ? getNumericValue(String(props.styles[props.styleItem]))
            : props.styles[props.styleItem]
        }
        onChange={(e) => handleChange(e, props.styleItem)}
        style={styles.inputBox}
        placeholder={props.defaultValue}
        disabled={unit === "auto" ? true : false}
        pattern="^[0-9]+$"
      /> */}
      <ControlledInput
        type="text"
        value={
          props.styles[props.styleItem] !== "auto"
            ? getNumericValue(String(props.styles[props.styleItem]))
            : props.styles[props.styleItem]
        }
        onChange={handleChange}
        styleItem={props.styleItem}
        disabled={unit}
        placeholder={props.defaultValue}
        pattern="^[0-9]+$"
      />

      <div className="dropdown" style={{ position: "relative" }}>
        <button className="dropbtn">{unit ? unit : null}</button>
        <div
          className="dropdown-content"
          style={{ position: "absolute", left: "0" }}
        >
          <p
            onClick={() => {
              handleUnitChange("px", props.styleItem);
            }}
          >
            px
          </p>
          <p
            onClick={() => {
              handleUnitChange("%", props.styleItem);
            }}
          >
            %
          </p>
          <p
            onClick={() => {
              handleUnitChange("em", props.styleItem);
            }}
          >
            em
          </p>
          <p
            onClick={() => {
              handleUnitChange("rem", props.styleItem);
            }}
          >
            rem
          </p>
          <p
            onClick={() => {
              handleUnitChange("ch", props.styleItem);
            }}
          >
            ch
          </p>
          <p
            onClick={() => {
              handleUnitChange("vw", props.styleItem);
            }}
          >
            vw
          </p>
          <p
            onClick={() => {
              handleUnitChange("vh", props.styleItem);
            }}
          >
            vh
          </p>
          <p
            onClick={() => {
              handleUnitChange("auto", props.styleItem);
            }}
          >
            auto
          </p>
        </div>
      </div>
    </div>
  );
};
