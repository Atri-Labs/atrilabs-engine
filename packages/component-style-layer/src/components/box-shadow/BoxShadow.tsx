import {
  gray100,
  gray200,
  gray400,
  gray800,
  h5Heading,
  smallText,
} from "@atrilabs/design-system";
import { ReactComponent as DropDownArrow } from "../../assets/layout-parent/dropdown-icon.svg";
import { CssProprtyComponentType } from "../../types";
import { useCallback, useMemo, useState } from "react";
import { ReactComponent as AddIcon } from "../../assets/add.svg";
import { ReactComponent as MinusIcon } from "../../assets/minus.svg";
import { ColorComponent } from "../commons/ColorComponent";

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
  drop: {
    display: "flex",
    alignItems: "baseline",
    cursor: "pointer",
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
  optionName: {
    ...smallText,
    width: "1.5rem",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
  select: {
    textAlign: "left",
  },
  option: {
    ...h5Heading,
    color: gray200,
    display: "flex",
    paddingLeft: "0.5rem",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
};

type boxShadowType = {
  hOffset: number;
  vOffset: number;
  blur: number;
  spread: number;
  color: string;
  shadowType: string;
};

export const BoxShadow: React.FC<CssProprtyComponentType> = (props) => {
  const [showProperties, setShowProperties] = useState(true);

  const boxShadows = useMemo(() => {
    const boxShadowArray = props.styles.boxShadow
      ? props.styles.boxShadow.split(",")
      : [];
    const boxShadows: boxShadowType[] = [];
    for (let i = 0; i < boxShadowArray.length; i++) {
      const boxShadowStr = boxShadowArray[i].trim().split(" ");
      let boxShadow: boxShadowType = {
        hOffset: parseInt(boxShadowStr[0]),
        vOffset: parseInt(boxShadowStr[1]),
        blur: parseInt(boxShadowStr[2]),
        spread: parseInt(boxShadowStr[3]),
        color: boxShadowStr[4] || "",
        shadowType: boxShadowStr[5] || "",
      };

      boxShadows[i] = boxShadow;
    }
    return boxShadows;
  }, [props.styles.boxShadow]);

  const updateBoxShadow = useCallback(
    (boxShadows: boxShadowType[]) => {
      let boxShadowStr = "";
      for (let i = 0; i < boxShadows.length; i++) {
        if (i > 0) boxShadowStr += ", ";
        boxShadowStr += `${boxShadows[i].hOffset || 0}px `;
        boxShadowStr += `${boxShadows[i].vOffset || 0}px `;
        boxShadowStr += `${boxShadows[i].blur || 0}px `;
        boxShadowStr += `${boxShadows[i].spread || 0}px `;
        boxShadowStr += `${boxShadows[i].color || ""} `;
        boxShadowStr += `${boxShadows[i].shadowType || ""}`;
      }
      props.patchCb({
        property: {
          styles: {
            boxShadow: boxShadowStr,
          },
        },
      });
    },
    [props]
  );

  const addBoxShadowsCb = useCallback(() => {
    const updatedValue = [
      ...boxShadows,
      {
        hOffset: 0,
        vOffset: 0,
        blur: 0,
        spread: 0,
        color: "",
        shadowType: "",
      },
    ];
    updateBoxShadow(updatedValue);
  }, [boxShadows, updateBoxShadow]);

  const deleteValueCb = useCallback(
    (index: number) => {
      const updatedValue = [...boxShadows];
      updatedValue.splice(index, 1);
      updateBoxShadow(updatedValue);
    },
    [boxShadows, updateBoxShadow]
  );

  const updateHOffsetValueCb = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const oldValue = boxShadows[index];
    oldValue.hOffset = parseInt(e.target.value) || 0;
    const updatedValue = [...boxShadows];
    updatedValue.splice(index, 1, oldValue);
    updateBoxShadow(updatedValue);
  };

  const updateVOffsetValueCb = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const oldValue = boxShadows[index];
    oldValue.vOffset = parseInt(e.target.value) || 0;
    const updatedValue = [...boxShadows];
    updatedValue.splice(index, 1, oldValue);
    updateBoxShadow(updatedValue);
  };

  const updateSpreadValueCb = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const oldValue = boxShadows[index];
    oldValue.spread = parseInt(e.target.value) || 0;
    const updatedValue = [...boxShadows];
    updatedValue.splice(index, 1, oldValue);
    updateBoxShadow(updatedValue);
  };

  const updateBlurValueCb = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const oldValue = boxShadows[index];
    oldValue.blur = parseInt(e.target.value) || 0;
    const updatedValue = [...boxShadows];
    updatedValue.splice(index, 1, oldValue);
    updateBoxShadow(updatedValue);
  };

  const updateColorValueCb = (color: string, index: number) => {
    const oldValue = boxShadows[index];
    oldValue.color = color;
    const updatedValue = [...boxShadows];
    updatedValue.splice(index, 1, oldValue);
    updateBoxShadow(updatedValue);
  };

  const updateShadowTypeValueCb = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const oldValue = boxShadows[index];
    oldValue.shadowType = e.target.value;
    const updatedValue = [...boxShadows];
    updatedValue.splice(index, 1, oldValue);
    updateBoxShadow(updatedValue);
  };

  return (
    <div style={styles.container}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={styles.drop}>
          <DropDownArrow
            onClick={() => setShowProperties(!showProperties)}
            style={
              !showProperties
                ? { transform: "rotate(-90deg)" }
                : { transform: "rotate(0deg)" }
            }
          />
          <div style={styles.header}>Box Shadow</div>
        </div>
        <AddIcon onClick={() => addBoxShadowsCb()} />
      </div>
      <div
        style={
          showProperties
            ? { display: "flex", rowGap: "1rem", flexDirection: "column" }
            : { display: "none" }
        }
      >
        {boxShadows.map((boxShadow, index) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "0.5em",
                borderBottom: "1px solid #fff",
              }}
              key={index}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "#fff",
                }}
              >
                <div style={styles.header}>Shadow {index + 1}</div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                  }}
                  onClick={() => deleteValueCb(index)}
                >
                  <MinusIcon />
                </div>
              </div>
              <div style={styles.option}>
                <div>h-offset</div>
                <input
                  onChange={(e) => updateHOffsetValueCb(e, index)}
                  type="text"
                  value={boxShadow.hOffset}
                  style={styles.inputBox}
                  placeholder="0"
                  pattern="^[0-9]+$"
                />
              </div>
              <div style={styles.option}>
                <div>v-offset</div>
                <input
                  onChange={(e) => updateVOffsetValueCb(e, index)}
                  type="text"
                  value={boxShadow.vOffset}
                  style={styles.inputBox}
                  placeholder="0"
                  pattern="^[0-9]+$"
                />
              </div>
              <div style={styles.option}>
                <div>spread</div>
                <input
                  onChange={(e) => updateSpreadValueCb(e, index)}
                  type="text"
                  value={boxShadow.spread}
                  style={styles.inputBox}
                  placeholder="0"
                  pattern="^[0-9]+$"
                />
              </div>
              <div style={styles.option}>
                <div>blur</div>
                <input
                  onChange={(e) => updateBlurValueCb(e, index)}
                  type="text"
                  value={boxShadow.blur}
                  style={styles.inputBox}
                  placeholder="0"
                  pattern="^[0-9]+$"
                />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <ColorComponent
                  name="Box Shadow"
                  styleItem="boxShadow"
                  index={index}
                  currentColor={boxShadow.color}
                  referenceProperty={boxShadow}
                  changeColor={updateColorValueCb}
                  styles={props.styles}
                  patchCb={props.patchCb}
                  openPalette={props.openPalette}
                />
              </div>
              <div style={{ ...styles.option, paddingBottom: "0.5em" }}>
                <div>shadow-type</div>
                <select
                  name="shadow-type"
                  onChange={(e) => updateShadowTypeValueCb(e, index)}
                  style={{ ...styles.inputBox, width: "77px" }}
                  value={boxShadow.shadowType || ""}
                >
                  <option style={styles.select} value=""></option>
                  <option style={styles.select} value="inset">
                    inset
                  </option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
