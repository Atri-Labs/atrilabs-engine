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
import { useCallback, useState } from "react";
import { ReactComponent as AddIcon } from "../../assets/add.svg";
import { ReactComponent as MinusIcon } from "../../assets/minus.svg";

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
  const [boxShadows, setBoxShadows] = useState<boxShadowType[]>([]);

  const deleteValueCb = useCallback(
    (index: number) => {
      const updatedValue = [...boxShadows];
      updatedValue.splice(index, 1);
      setBoxShadows(updatedValue);
    },
    [boxShadows]
  );

  const updateBoxShadow = useCallback(() => {
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
    console.log("updateBoxShadow", boxShadowStr);
    props.patchCb({
      property: {
        styles: {
          boxShadow: boxShadowStr,
        },
      },
    });
  }, [boxShadows, props]);

  const updateHOffsetValueCb = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const oldValue = boxShadows[index];
    oldValue.hOffset = parseInt(e.target.value) || 0;
    const updatedValue = [...boxShadows];
    updatedValue.splice(index, 1, oldValue);
    setBoxShadows(updatedValue);
    updateBoxShadow();
  };

  const updateVOffsetValueCb = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const oldValue = boxShadows[index];
    oldValue.vOffset = parseInt(e.target.value) || 0;
    const updatedValue = [...boxShadows];
    updatedValue.splice(index, 1, oldValue);
    setBoxShadows(updatedValue);
    updateBoxShadow();
  };

  const updateSpreadValueCb = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const oldValue = boxShadows[index];
    oldValue.spread = parseInt(e.target.value) || 0;
    const updatedValue = [...boxShadows];
    updatedValue.splice(index, 1, oldValue);
    setBoxShadows(updatedValue);
    updateBoxShadow();
  };

  const updateBlurValueCb = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const oldValue = boxShadows[index];
    oldValue.blur = parseInt(e.target.value) || 0;
    const updatedValue = [...boxShadows];
    updatedValue.splice(index, 1, oldValue);
    setBoxShadows(updatedValue);
    updateBoxShadow();
  };

  const updateColorValueCb = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const oldValue = boxShadows[index];
    oldValue.color = e.target.value;
    const updatedValue = [...boxShadows];
    updatedValue.splice(index, 1, oldValue);
    setBoxShadows(updatedValue);
    updateBoxShadow();
  };

  const updateShadowTypeValueCb = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const oldValue = boxShadows[index];
    oldValue.shadowType = e.target.value;
    const updatedValue = [...boxShadows];
    updatedValue.splice(index, 1, oldValue);
    setBoxShadows(updatedValue);
    updateBoxShadow();
  };

  // props.patchCb({
  //   property: {
  //     styles: {
  //       boxShadow: "6px 4px red",
  //     },
  //   },
  // });

  console.log("Props", props.styles);

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
        <AddIcon
          onClick={() =>
            setBoxShadows((boxShadows: boxShadowType[]) => [
              ...boxShadows,
              {
                hOffset: 0,
                vOffset: 0,
                blur: 0,
                spread: 0,
                color: "",
                shadowType: "",
              },
            ])
          }
        />
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
                  style={{ display: "flex" }}
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
              <div style={styles.option}>
                <div>color</div>
                <input
                  onChange={(e) => updateColorValueCb(e, index)}
                  type="text"
                  value={boxShadow.color}
                  style={styles.inputBox}
                  placeholder=""
                />
              </div>
              <div style={{ ...styles.option, paddingBottom: "0.5em" }}>
                <div>shadow-type</div>
                <input
                  onChange={(e) => updateShadowTypeValueCb(e, index)}
                  type="text"
                  value={boxShadow.shadowType}
                  style={styles.inputBox}
                  placeholder=""
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
