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
    width: "57px",
    height: "26px",
    border: "none",
    borderRadius: "2px",
  },
  select: {
    textAlign: "left",
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

  const updateHOffsetValueCb = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const oldValue = boxShadows[index];
    oldValue.hOffset = parseInt(e.target.value) || 0;
    const updatedValue = [...boxShadows];
    updatedValue.splice(index, 1, oldValue);
    setBoxShadows(updatedValue);
  };

  props.patchCb({
    property: {
      styles: {
        boxShadow: "6px 4px red",
      },
    },
  });

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
              <div
                style={{
                  ...h5Heading,
                  color: gray200,
                  display: "flex",
                  paddingLeft: "0.5rem",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <div>h-offset</div>
                <input
                  onChange={(e) => updateHOffsetValueCb(e, index)}
                  type="text"
                  value={boxShadows[index].hOffset}
                  style={{
                    ...smallText,
                    outline: "none",
                    color: gray100,
                    backgroundColor: gray800,
                    height: "26px",
                    width: "25px",
                    border: "none",
                    borderRadius: "2px 0 0 2px",
                    paddingLeft: "6px",
                  }}
                  placeholder="0"
                  pattern="^[0-9]+$"
                />
              </div>
              <div
                style={{
                  ...h5Heading,
                  color: gray200,
                  display: "flex",
                  paddingLeft: "0.5rem",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <div>v-offset</div>
                <input
                  // onChange={handleChange}
                  type="text"
                  value={boxShadows[index].vOffset}
                  style={{
                    ...smallText,
                    outline: "none",
                    color: gray100,
                    backgroundColor: gray800,
                    height: "26px",
                    width: "25px",
                    border: "none",
                    borderRadius: "2px 0 0 2px",
                    paddingLeft: "6px",
                  }}
                  placeholder="0"
                  pattern="^[0-9]+$"
                />
              </div>
              <div
                style={{
                  ...h5Heading,
                  color: gray200,
                  display: "flex",
                  paddingLeft: "0.5rem",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <div>spread</div>
                <input
                  // onChange={handleChange}
                  type="text"
                  value={boxShadows[index].spread}
                  style={{
                    ...smallText,
                    outline: "none",
                    color: gray100,
                    backgroundColor: gray800,
                    height: "26px",
                    width: "25px",
                    border: "none",
                    borderRadius: "2px 0 0 2px",
                    paddingLeft: "6px",
                  }}
                  placeholder="0"
                  pattern="^[0-9]+$"
                />
              </div>
              <div
                style={{
                  ...h5Heading,
                  color: gray200,
                  display: "flex",
                  paddingLeft: "0.5rem",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <div>blur</div>
                <input
                  // onChange={handleChange}
                  type="text"
                  value={boxShadows[index].blur}
                  style={{
                    ...smallText,
                    outline: "none",
                    color: gray100,
                    backgroundColor: gray800,
                    height: "26px",
                    width: "25px",
                    border: "none",
                    borderRadius: "2px 0 0 2px",
                    paddingLeft: "6px",
                  }}
                  placeholder="0"
                  pattern="^[0-9]+$"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
