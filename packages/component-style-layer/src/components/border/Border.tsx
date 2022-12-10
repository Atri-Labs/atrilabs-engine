import {
  gray100,
  gray200,
  gray400,
  gray800,
  smallText,
  h5Heading,
  gray500,
  agastyaLine,
} from "@atrilabs/design-system";
import React, { useState, useEffect, useCallback } from "react";
import { ReactComponent as BC } from "../../assets/border/border-color-icon.svg";
import { ReactComponent as BR } from "../../assets/border/border-radius-icon.svg";
import { ReactComponent as BS } from "../../assets/border/border-style-icon.svg";
import { ReactComponent as BW } from "../../assets/border/border-width-icon.svg";
import { ReactComponent as Minus } from "../../assets/background/none-icon.svg";
import { ReactComponent as DropDownArrow } from "../../assets/layout-parent/dropdown-icon.svg";
import { CssProprtyComponentType } from "../../types";
import { ColorComponent } from "../commons/ColorComponent";
import { ColorComponentWithoutEffect } from "../commons/ColorComponentWithoutEffect";
import { SizeInputWithoutEffect } from "../commons/SizeInputWithoutEffect";
import { SizeInputWithUnits } from "../commons/SizeInputWithUnits";

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
  inputBox: {
    ...smallText,
    outline: "none",
    color: gray100,
    backgroundColor: gray800,
    width: "57px",
    height: "26px",
    border: "none",
    borderRadius: "2px",
  },
  drop: {
    display: "flex",
    alignItems: "baseline",
    cursor: "pointer",
  },
  optionName: {
    ...smallText,
    width: "1.5rem",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  select: {
    textAlign: "left",
  },
  gridContainer: {
    ...smallText,
    color: gray400,
    display: "grid",
    gridTemplateColumns: "15px 60px 15px 60px",
    rowGap: "1rem",
    textAlign: "center",
    columnGap: "1rem",
  },
  bsGridContainer: {
    ...smallText,
    color: gray400,
    display: "grid",
    gridTemplateColumns: "15px 60px 15px 60px",
    rowGap: "1rem",
    textAlign: "center",
    columnGap: "1rem",
  },
  brgridContainer: {
    ...smallText,
    color: gray400,
    display: "grid",
    gridTemplateColumns: "15px 60px 60px",
    rowGap: "1rem",
    textAlign: "center",
    columnGap: "1rem",
  },
  borderGrid: {
    ...smallText,
    color: gray400,
    display: "grid",
    gridTemplateColumns: "50px 50px 50px",
    rowGap: "1rem",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    columnGap: "1rem",
  },
  borderOption: {
    ...smallText,
    color: gray200,
    backgroundColor: gray500,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "4px",
    paddingBottom: "4px",
    cursor: "pointer",
  },
  gridInputContainer: {
    ...smallText,
    color: gray400,
    display: "grid",
    gridTemplateColumns: "15px 60px 40px 40px",
    rowGap: "1rem",
    textAlign: "center",
    columnGap: "1rem",
  },
  borderTypeGridContainer: {
    ...smallText,
    color: gray400,
    display: "grid",
    gridTemplateColumns: "15px 60px 15px 60px",
    rowGap: "1rem",
    textAlign: "center",
    columnGap: "1rem",
  },
  inputContainer: {
    display: "flex",
  },
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    paddingTop: "2px",
    paddingBottom: "2px",
    paddingLeft: "8px",
    paddingRight: "8px",
    cursor: "pointer",
    color: gray200,
  },
  typesContainer: {
    display: "grid",
    height: "100%",
  },
};

export type borderRadiusTypeOptions = {
  all: boolean;
  separate: boolean;
};
export type boxShadowPropsType = {
  inset: boolean;
  xoffset: string;
  yoffset: string;
  blur: string;
  spread: string;
};
export const singleBorderRadiusOptions: borderRadiusTypeOptions = {
  all: true,
  separate: false,
};
export const separateBorderRadiusOptions: borderRadiusTypeOptions = {
  all: false,
  separate: true,
};
const borderRadiusTypes = [
  singleBorderRadiusOptions,
  separateBorderRadiusOptions,
];
export const Border: React.FC<CssProprtyComponentType> = (props) => {
  const [showProperties, setShowProperties] = useState(true);
  const patchCb = props.patchCb;
  const handleBorderChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    styleItem: keyof React.CSSProperties
  ) => {
    console.log(styleItem);
    props.patchCb({
      property: {
        styles: {
          [styleItem]: e.target.value,
        },
      },
    });
  };

  const [activeBorderType, setActiveBorderType] = useState<string>("");

  const setBorderType = (value: string) => {
    setActiveBorderType(value);
    setBorderTypeWidth();
    setBorderTypeStyle();
    setBorderTypeColor();
  };

  const setBorderTypeWidth = (): keyof React.CSSProperties => {
    if (activeBorderType === "Top") {
      return "borderTopWidth";
    } else if (activeBorderType === "Left") {
      return "borderLeftWidth";
    } else if (activeBorderType === "Right") {
      return "borderRightWidth";
    } else if (activeBorderType === "Bottom") {
      return "borderBottomWidth";
    } else {
      return "borderWidth";
    }
  };
  const setBorderTypeStyle = (): keyof React.CSSProperties => {
    if (activeBorderType === "Top") {
      return "borderTopStyle";
    } else if (activeBorderType === "Left") {
      return "borderLeftStyle";
    } else if (activeBorderType === "Right") {
      return "borderRightStyle";
    } else if (activeBorderType === "Bottom") {
      return "borderBottomStyle";
    } else {
      return "borderStyle";
    }
  };
  const setBorderTypeColor = (): keyof React.CSSProperties => {
    if (activeBorderType === "Top") {
      return "borderTopColor";
    } else if (activeBorderType === "Left") {
      return "borderLeftColor";
    } else if (activeBorderType === "Right") {
      return "borderRightColor";
    } else if (activeBorderType === "Bottom") {
      return "borderBottomColor";
    } else {
      return "borderColor";
    }
  };

  const [selectedBorderRadiusTypeIndex, setSelectedBorderRadiusTypeIndex] =
    useState<number>(0);

  // Box Shadow
  const [boxShadowProps, setBoxShadowProps] = useState([
    {
      inset: false,
      xoffset: "0px",
      yoffset: "0px",
      blur: "0px",
      spread: "0px",
      color: "ffffff",
    },
  ]);
  const createColorArray = () => {
    let arr;
    boxShadowProps.forEach((bsProp, index) => {
      arr.push(bsProp.color);
    });
    if (arr) {
      props.colorValueArraySetter(arr);
    }

    return arr;
  };

  const [boxShadow, setBoxShadow] = useState<string>("");

  const handleInsetChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const arr = [...boxShadowProps];
    arr[index].inset = e.target.checked;
    setBoxShadowProps(arr);
  };

  const handleBoxShadowChange = useCallback(() => {
    patchCb({
      property: {
        styles: {
          boxShadow: boxShadow,
        },
      },
    });
  }, [patchCb, boxShadow]);

  // useEffect(() => {
  //   setBoxShadow(
  //     boxShadowProps[0].inset
  //       ? "inset" +
  //           " " +
  //           boxShadowProps[0].xoffset +
  //           " " +
  //           boxShadowProps[0].yoffset +
  //           " " +
  //           boxShadowProps[0].blur +
  //           " " +
  //           boxShadowProps[0].spread +
  //           " " +
  //           props.colorValue
  //       : boxShadowProps[0].xoffset +
  //           " " +
  //           boxShadowProps[0].yoffset +
  //           " " +
  //           boxShadowProps[0].blur +
  //           " " +
  //           boxShadowProps[0].spread +
  //           " " +
  //           props.colorValue
  //   );

  //   handleBoxShadowChange();
  // }, [props.colorValue, boxShadowProps, handleBoxShadowChange]);

  const handleBsIncrement = () => {
    setBoxShadowProps((boxShadowProps) => [
      ...boxShadowProps,
      {
        inset: false,
        xoffset: "0px",
        yoffset: "0px",
        blur: "0px",
        spread: "0px",
        color: "ffffff",
      },
    ]);
    createColorArray();
  };

  const handleBsDecrement = (index: number) => {
    const arr = [...boxShadowProps];
    if (arr.length > 1) {
      arr.splice(index, 1);
    }
    setBoxShadowProps(arr);
    createColorArray();
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
        <div style={styles.header}>Border</div>
      </div>
      <div
        style={
          showProperties
            ? { display: "flex", rowGap: "2rem", flexDirection: "column" }
            : { display: "none" }
        }
      >
        <div
          style={{ display: "flex", rowGap: "1rem", flexDirection: "column" }}
        >
          <div style={styles.brgridContainer}>
            <span style={styles.optionName}>
              <BR />
            </span>
            <div
              style={{
                ...styles.typesContainer,
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              <div
                style={
                  selectedBorderRadiusTypeIndex === 0
                    ? {
                        ...styles.iconContainer,
                        borderRight: `1px solid ${agastyaLine}`,
                        background: gray800,
                      }
                    : {
                        ...styles.iconContainer,
                        borderRight: `1px solid ${agastyaLine}`,
                        background: gray500,
                      }
                }
                onClick={() => {
                  setSelectedBorderRadiusTypeIndex(0);
                }}
              >
                Uniform
              </div>
              <div
                style={
                  selectedBorderRadiusTypeIndex === 1
                    ? {
                        ...styles.iconContainer,
                        background: gray800,
                      }
                    : {
                        ...styles.iconContainer,
                        background: gray500,
                      }
                }
                onClick={() => {
                  setSelectedBorderRadiusTypeIndex(1);
                }}
              >
                Non-Uniform
              </div>
            </div>
          </div>

          {borderRadiusTypes[selectedBorderRadiusTypeIndex].all && (
            <div style={styles.borderTypeGridContainer}>
              <div style={styles.optionName}>
                <span>&nbsp;</span>
              </div>
              <SizeInputWithUnits
                styleItem="borderRadius"
                styles={props.styles}
                patchCb={props.patchCb}
                defaultValue="0"
              />
            </div>
          )}
          {borderRadiusTypes[selectedBorderRadiusTypeIndex].separate && (
            <div style={styles.borderTypeGridContainer}>
              <div style={styles.optionName}>
                <span>TL</span>
              </div>
              <SizeInputWithUnits
                styleItem="borderTopLeftRadius"
                styles={props.styles}
                patchCb={props.patchCb}
                defaultValue="0"
              />
              <div style={styles.optionName}>
                <span>TR</span>
              </div>
              <SizeInputWithUnits
                styleItem="borderTopRightRadius"
                styles={props.styles}
                patchCb={props.patchCb}
                defaultValue="0"
              />
              <div style={styles.optionName}>
                <span>BL</span>
              </div>
              <SizeInputWithUnits
                styleItem="borderBottomLeftRadius"
                styles={props.styles}
                patchCb={props.patchCb}
                defaultValue="0"
              />
              <div style={styles.optionName}>
                <span>BR</span>
              </div>
              <SizeInputWithUnits
                styleItem="borderBottomRightRadius"
                styles={props.styles}
                patchCb={props.patchCb}
                defaultValue="0"
              />
            </div>
          )}

          <div style={styles.borderGrid}>
            <span>&nbsp;</span>
            <span
              onClick={(e) => {
                setBorderType("Top");
              }}
              style={
                activeBorderType === "Top"
                  ? { ...styles.borderOption, backgroundColor: gray800 }
                  : { ...styles.borderOption }
              }
            >
              T
            </span>
            <span>&nbsp;</span>
            <span
              onClick={(e) => {
                setBorderType("Left");
              }}
              style={
                activeBorderType === "Left"
                  ? { ...styles.borderOption, backgroundColor: gray800 }
                  : { ...styles.borderOption }
              }
            >
              L
            </span>
            <span
              onClick={(e) => {
                setBorderType("");
              }}
              style={
                activeBorderType === ""
                  ? { ...styles.borderOption, backgroundColor: gray800 }
                  : { ...styles.borderOption }
              }
            >
              A
            </span>
            <span
              onClick={(e) => {
                setBorderType("Right");
              }}
              style={
                activeBorderType === "Right"
                  ? { ...styles.borderOption, backgroundColor: gray800 }
                  : { ...styles.borderOption }
              }
            >
              R
            </span>
            <span>&nbsp;</span>
            <span
              onClick={(e) => {
                setBorderType("Bottom");
              }}
              style={
                activeBorderType === "Bottom"
                  ? { ...styles.borderOption, backgroundColor: gray800 }
                  : { ...styles.borderOption }
              }
            >
              B
            </span>
            <span>&nbsp;</span>
          </div>

          <div style={styles.gridContainer}>
            <div style={styles.optionName}>
              <BW />
            </div>
            <div>
              <SizeInputWithUnits
                styleItem={setBorderTypeWidth()}
                styles={props.styles}
                patchCb={props.patchCb}
                defaultValue=""
              />
            </div>

            <div style={styles.optionName}>
              <BS />
            </div>
            <div style={{ marginLeft: "-2px" }}>
              <select
                name="Border Style"
                onChange={(e) => handleBorderChange(e, setBorderTypeStyle())}
                style={styles.inputBox}
                value={props.styles[setBorderTypeStyle()] || ""}
              >
                <option style={styles.select} value={""}></option>
                <option style={styles.select} value="none">
                  none
                </option>
                <option style={styles.select} value="solid">
                  solid
                </option>
                <option style={styles.select} value="dashed">
                  dashed
                </option>
                <option style={styles.select} value="dotted">
                  dotted
                </option>
              </select>
            </div>
          </div>
          <div style={styles.gridInputContainer}>
            <ColorComponent
              name="Border Color"
              styleItem={setBorderTypeColor()}
              styles={props.styles}
              patchCb={props.patchCb}
              openPalette={props.openPalette}
            />
          </div>
        </div>
        <div
          style={{ display: "flex", rowGap: "1rem", flexDirection: "column" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={styles.header}>Box Shadow</div>
            <div style={styles.header} onClick={handleBsIncrement}>
              +
            </div>
          </div>
          {boxShadowProps.map((bs, index) => {
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  rowGap: "1rem",
                  flexDirection: "column",
                  paddingLeft: "0.5rem",
                  paddingRight: "0.5rem",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={styles.bsGridContainer}>
                    <div style={styles.optionName}>Inset</div>
                    <input
                      type="checkbox"
                      onChange={(e) => handleInsetChange(e, index)}
                    />
                  </div>
                  <div
                    style={{
                      color: gray200,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      userSelect: "none",
                    }}
                    onClick={(e) => handleBsDecrement(index)}
                  >
                    <Minus />
                  </div>
                </div>
                <div style={styles.bsGridContainer}>
                  <div style={styles.optionName}>X-Off</div>
                  <div>
                    <SizeInputWithoutEffect
                      value={boxShadowProps}
                      name="xoffset"
                      index={index}
                      setValue={setBoxShadowProps}
                      styleItem="boxShadow"
                      styles={props.styles}
                      patchCb={props.patchCb}
                      defaultValue=""
                    />
                  </div>
                  <div style={styles.optionName}>Y-Off</div>
                  <div>
                    <SizeInputWithoutEffect
                      value={boxShadowProps}
                      index={index}
                      name="yoffset"
                      setValue={setBoxShadowProps}
                      styleItem="boxShadow"
                      styles={props.styles}
                      patchCb={props.patchCb}
                      defaultValue=""
                    />
                  </div>
                  <div style={styles.optionName}>Blur</div>
                  <div>
                    <SizeInputWithoutEffect
                      value={boxShadowProps}
                      index={index}
                      name="blur"
                      setValue={setBoxShadowProps}
                      styleItem="boxShadow"
                      styles={props.styles}
                      patchCb={props.patchCb}
                      defaultValue=""
                    />
                  </div>
                  <div style={styles.optionName}>Spread</div>
                  <div>
                    <SizeInputWithoutEffect
                      value={boxShadowProps}
                      index={index}
                      name="spread"
                      setValue={setBoxShadowProps}
                      styleItem="boxShadow"
                      styles={props.styles}
                      patchCb={props.patchCb}
                      defaultValue=""
                    />
                  </div>
                </div>
                <div style={styles.gridInputContainer}>
                  <div style={styles.optionName}>
                    <BC />
                  </div>
                  <ColorComponentWithoutEffect
                    name="Color"
                    value={props.colorValue}
                    setValue={props.setColorValue}
                    styleItem="boxShadow"
                    styles={props.styles}
                    patchCb={props.patchCb}
                    openPaletteWithoutEffect={props.openPaletteWithoutEffect}
                    index={index}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
