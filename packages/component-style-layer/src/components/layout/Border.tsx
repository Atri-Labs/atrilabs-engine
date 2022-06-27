import {
  gray200,
  gray400,
  smallText,
  h5Heading,
} from "@atrilabs/design-system";
import React, { useState } from "react";
import { ReactComponent as FCAAuto } from "../../assets/fc-align/fca-auto.svg";
import { ReactComponent as FCAFlexStart } from "../../assets/fc-align/fca-flex-start-icon.svg";
import { ReactComponent as FCAFlexEnd } from "../../assets/fc-align/fca-flex-end-icon.svg";
import { ReactComponent as FCAFlexCenter } from "../../assets/fc-align/fca-flex-center-icon.svg";
import { ReactComponent as FCAFlexStretch } from "../../assets/fc-align/fca-stretch-icon.svg";
import { ReactComponent as FCAFlexBaseline } from "../../assets/fc-align/fca-baseline-icon.svg";
import { ReactComponent as DropDownArrow } from "../../assets/layout-parent/dropdown-icon.svg";
import { ReactComponent as Rectangle } from "../../assets/layout-parent/Rectangle-714.svg";

import { CssProprtyComponentType } from "../../types";
import PropertyRender from "./PropertyRender";

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "0.5rem",
    borderBottom: "1px solid #111827",
  },
  header: {
    ...h5Heading,
    color: gray200,
    display: "flex",
    marginTop: "5px",
    paddingBottom: "0.5rem",
    height: "25px",
    paddingLeft: "0.5rem",
    userSelect: "none",
  },
  rectLabel: {
    ...smallText,
    color: gray400,
    display: "flex",
    textAlign: "center",
    lineHeight: "0px",
  },
  label: {
    marginTop: "0px",
    marginBottom: "10px",
  },
  drop: {
    display: "flex",
    alignItems: "baseline",
  },
  option: {
    display: "flex",
    height: "25px",
    marginBottom: "15px",
  },
  optionName: {
    ...smallText,
    width: "4rem",
    color: "white",
    display: "flex",
    alignItems: "center",
  },
  optionsIcons: {
    flexGrow: 1,
  },
};

export const Border: React.FC<CssProprtyComponentType> = (props) => {
  const [dis3, setDis3] = useState(true);

  return (
    <div style={styles.container}>
      <div style={styles.drop}>
        <DropDownArrow
          onClick={() => setDis3(!dis3)}
          style={
            !dis3
              ? { transform: "rotate(-90deg)" }
              : { transform: "rotate(0deg)" }
          }
        />
        <div style={styles.header}>Border</div>
      </div>
      <div style={dis3 ? { display: "block" } : { display: "none" }}>
        <div style={styles.option}>
          <div style={styles.optionName}>R</div>
          <div style={styles.rectLabel}>
            <div style={{ marginRight: "22px" }}>
              <Rectangle style={styles.rect} />
            </div>
            <div style={{ marginRight: "22px" }}>
              <Rectangle style={styles.rect} />
            </div>
          </div>
        </div>
        <div style={styles.option}>
          <div style={styles.optionName}>S</div>
          <div style={styles.rectLabel}>
            <div style={{ marginRight: "22px" }}>
              <Rectangle style={styles.rect} />
            </div>
            <div style={{ marginRight: "22px" }}>
              <Rectangle style={styles.rect} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
