import {
  gray200,
  gray400,
  gray800,
  h5Heading,
  smallText,
} from "@atrilabs/design-system";
import { ReactComponent as DropDownArrow } from "../../assets/layout-parent/dropdown-icon.svg";
import { CssProprtyComponentType } from "../../types";
import { useState } from "react";
import { SizeInputWithUnits } from "../commons/SizeInputWithUnits";
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
};

export const BoxShadow: React.FC<CssProprtyComponentType> = (props) => {
  const [showProperties, setShowProperties] = useState(true);
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
        <div style={styles.header}>Box Shadow</div>
      </div>
      <div
        style={
          showProperties
            ? { display: "flex", rowGap: "2rem", flexDirection: "column" }
            : { display: "none" }
        }
      >
        <div style={styles.gridContainer}>
          <div style={styles.optionName}>
            <div style={{ ...smallText, color: gray200 }}>h-offset</div>
          </div>
          <div>
            <SizeInputWithUnits
              styleItem="outlineOffset"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue="0"
            />
          </div>
          <div style={styles.optionName}>
            <div style={{ ...smallText, color: gray200 }}>v-offset</div>
          </div>
          <div>
            <SizeInputWithUnits
              styleItem="outlineOffset"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue="0"
            />
          </div>
          <div style={styles.optionName}>
            <div style={{ ...smallText, color: gray200 }}>blur</div>
          </div>
          <div>
            <SizeInputWithUnits
              styleItem="outlineOffset"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue="0"
            />
          </div>
          <div style={styles.optionName}>
            <div style={{ ...smallText, color: gray200 }}>spread</div>
          </div>
          <div>
            <SizeInputWithUnits
              styleItem="outlineOffset"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue="0"
            />
          </div>
          <div style={styles.gridInputContainer}>
            <ColorComponent
              name="Box Shadow Color"
              styleItem="boxShadow"
              styles={props.styles}
              patchCb={props.patchCb}
              openPalette={props.openPalette}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
