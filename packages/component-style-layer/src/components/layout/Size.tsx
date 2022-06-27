import {
  gray200,
  gray400,
  smallText,
  h5Heading,
} from "@atrilabs/design-system";
import React, { useState } from "react";
import { ReactComponent as OFA } from "../../assets/size/Auto.svg";
import { ReactComponent as OFH } from "../../assets/size/overflow-hidden.svg";
import { ReactComponent as OFS } from "../../assets/size/overflow-scroll.svg";
import { ReactComponent as OFV } from "../../assets/size/overflow-visible.svg";
import { ReactComponent as Rectangle } from "../../assets/layout-parent/Rectangle-714.svg";
import { ReactComponent as DropDownArrow } from "../../assets/dropdown-icon.svg";

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

export const Size: React.FC<CssProprtyComponentType> = (props) => {
  const [dis4, setDis4] = useState(true);

  return (
    <div style={styles.container}>
      <div style={styles.drop}>
        <DropDownArrow
          onClick={() => setDis4(!dis4)}
          style={
            !dis4
              ? { transform: "rotate(-90deg)" }
              : { transform: "rotate(0deg)" }
          }
        />
        <div style={styles.header}>Size</div>
      </div>
      <div style={dis4 ? { display: "block" } : { display: "none" }}>
        <div style={styles.option}>
          <div style={styles.optionName}>W</div>
          <div style={styles.rectLabel}>
            <div style={{ marginRight: "22px" }}>
              <Rectangle style={styles.rect} />
            </div>
            <div style={{ marginRight: "22px" }}>
              <p style={styles.label}>Min</p>
              <Rectangle style={styles.rect} />
            </div>
            <div>
              <p style={styles.label}>Max</p>
              <Rectangle style={styles.rect} />
            </div>
          </div>
        </div>
        <div style={styles.option}>
          <div style={styles.optionName}>H</div>
          <div style={styles.rectLabel}>
            <div style={{ marginRight: "22px" }}>
              <Rectangle style={styles.rect} />
            </div>
            <div style={{ marginRight: "22px" }}>
              <p style={styles.label}>Min</p>
              <Rectangle style={styles.rect} />
            </div>
            <div>
              <p style={styles.label}>Max</p>
              <Rectangle style={styles.rect} />
            </div>
          </div>
        </div>

        <PropertyRender
          styles={{
            styleItem: "overflow",
            styleText: "Overflow",
            styleArray: ["visible", "scroll", "hidden", "auto"],
            patchCb: props.patchCb,
            styles: props.styles,
          }}
        >
          <OFV />
          <OFS />
          <OFH />
          <OFA />
        </PropertyRender>
      </div>
    </div>
  );
};
