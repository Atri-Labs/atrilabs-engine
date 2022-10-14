import { gray100, gray800, smallText } from "@atrilabs/design-system";
import React, { useCallback, useMemo } from "react";
import { CssProprtyComponentType } from "../../types";
import ControlledInput from "./ControlledInput";
import "./SizeInputWithUnits.css";
export type boxShadowPropsType = {
  inset: boolean;
  xoffset: string;
  yoffset: string;
  blur: string;
  spread: string;
};
export type SizeInputWithoutEffectProps = {
  value: any;
  index: number;
  name: string;
  setValue: (value: any) => void;
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

export const SizeInputWithoutEffect: React.FC<SizeInputWithoutEffectProps> = (
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
    return getUnitIndex(props.value[props.index][props.name]) === "auto"
      ? ""
      : getUnitIndex(String(props.value[props.index][props.name] || "px"));
  }, [props.name, props.index, props.value, getUnitIndex]);

  const parseValueUnit = (e: string, unit: string) => {
    return e ? e.concat(unit) : "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arr = [...props.value];
    if (!e.target.value) {
      props.value[props.index][props.name] = "" + unit;
    } else {
      unit === "auto"
        ? (arr[props.index][props.name] = "auto")
        : (arr[props.index][props.name] = parseValueUnit(e.target.value, unit));
    }
    props.setValue(arr);
  };

  const handleUnitChange = (unitValue: string) => {
    if (unitValue === "auto") {
      props.value[props.index][props.name] = "auto";
    } else {
      let val = getNumericValue(props.value[props.index][props.name]);
      props.value[props.index][props.name] = val.concat(unitValue);
    }
  };

  return (
    <div style={styles.container}>
      <ControlledInput
        type="text"
        value={
          props.value[props.index][props.name] !== "auto"
            ? getNumericValue(props.value[props.index][props.name])
            : props.value[props.index][props.name]
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
              handleUnitChange("px");
            }}
          >
            px
          </p>
          <p
            onClick={() => {
              handleUnitChange("%");
            }}
          >
            %
          </p>
          <p
            onClick={() => {
              handleUnitChange("em");
            }}
          >
            em
          </p>
          <p
            onClick={() => {
              handleUnitChange("rem");
            }}
          >
            rem
          </p>
          <p
            onClick={() => {
              handleUnitChange("ch");
            }}
          >
            ch
          </p>
          <p
            onClick={() => {
              handleUnitChange("vw");
            }}
          >
            vw
          </p>
          <p
            onClick={() => {
              handleUnitChange("vh");
            }}
          >
            vh
          </p>
          <p
            onClick={() => {
              handleUnitChange("auto");
            }}
          >
            auto
          </p>
        </div>
      </div>
    </div>
  );
};
