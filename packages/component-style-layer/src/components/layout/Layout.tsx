import {
  gray200,
  gray400,
  gray800,
  smallText,
  h5Heading,
  gray300,
} from "@atrilabs/design-system";
import React, { useState } from "react";
import { ReactComponent as DropDownArrow } from "../../assets/layout-parent/dropdown-icon.svg";
import { ReactComponent as RightArrow } from "../../assets/layout-parent/right-arrow.svg";
import { ReactComponent as DownArrow } from "../../assets/layout-parent/down-arrow.svg";
import { ReactComponent as LeftArrow } from "../../assets/layout-parent//left-arrow.svg";
import { ReactComponent as UpArrow } from "../../assets/layout-parent/up-arrow.svg";
import { ReactComponent as FlexStart } from "../../assets/layout-parent/flex-start.svg";
import { ReactComponent as FlexEnd } from "../../assets/layout-parent/flex-end.svg";
import { ReactComponent as FlexCenter } from "../../assets/layout-parent/flex-center.svg";
import { ReactComponent as FlexStretch } from "../../assets/layout-parent/stretch-vertical.svg";
import { ReactComponent as FlexBaseline } from "../../assets/layout-parent/baseline-vertical.svg";
import { ReactComponent as JCStart } from "../../assets/layout-parent/jc-flex-start-icon.svg";
import { ReactComponent as JCEnd } from "../../assets/layout-parent/jc-flex-end-icon.svg";
import { ReactComponent as JCCenter } from "../../assets/layout-parent/jc-flex-center-icon.svg";
import { ReactComponent as JCSpaceAround } from "../../assets/layout-parent/jc-space-around-icon.svg";
import { ReactComponent as JCSpaceBetween } from "../../assets/layout-parent/jc-space-between-icon.svg";
import { ReactComponent as NoWrap } from "../../assets/layout-parent/no-wrap-icon.svg";
import { ReactComponent as Wrap } from "../../assets/layout-parent/wrap-icon.svg";
import { ReactComponent as WrapRev } from "../../assets/layout-parent/wrap-rev-icon.svg";
import { ReactComponent as ACFlexStart } from "../../assets/layout-parent/ac-start-icon.svg";
import { ReactComponent as ACFlexEnd } from "../../assets/layout-parent/ac-end-icon.svg";
import { ReactComponent as ACFlexCenter } from "../../assets/layout-parent/ac-center-icon.svg";
import { ReactComponent as ACFlexStretch } from "../../assets/layout-parent/ac-stretch-icon.svg";
import { ReactComponent as ACFlexSpaceBetween } from "../../assets/layout-parent/ac-space-between-icon.svg";
import { ReactComponent as ACFlexSpaceAround } from "../../assets/layout-parent/ac-space-around-icon.svg";

import { CssProprtyComponentType } from "../../types";
import PropertyRender from "../commons/PropertyRender";
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
  drop: {
    display: "flex",
    alignItems: "baseline",
    cursor: "pointer",
  },
  option: {
    display: "flex",
    height: "25px",
    marginTop: "30px",
  },
  optionName: {
    ...smallText,
    textAlign: "left",
    color: "white",
    lineHeight: "25px",
  },
  gridContainer: {
    ...smallText,
    color: gray400,
    display: "grid",
    gridTemplateColumns: "2.5rem 58px 58px",
    textAlign: "center",
    columnGap: "25px",
    rowGap: "3px",
  },
};

// CSS Values for different CSS property (The default value must be at position 0)
// CSS values for flex-direction CSS property (The default value row is at position 0)

const directionValues = ["row", "column", "row-reverse", "column-reverse"];
const alignItemValues = [
  "stretch",
  "flex-start",
  "center",
  "flex-end",
  "baseline",
];
const justifyContentValues = [
  "flex-start",
  "center",
  "flex-end",
  "space-between",
  "space-around",
];
const wrapValues = ["nowrap", "wrap", "wrap-reverse"];
const alignContentValues = [
  "stretch",
  "flex-start",
  "center",
  "flex-end",
  "space-between",
  "space-around",
];
const displayValues = ["flex", "inline-flex", "none"];

// This serves as a Semi-Smart component, i.e. it uses useMemo but not useState or useRef.
export const Layout: React.FC<CssProprtyComponentType> = (props) => {
  const [showProperties, setShowProperties] = useState(true);

  return (
    <>
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
          <div style={styles.header}>Layout</div>
        </div>
        <div
          style={
            showProperties
              ? { display: "flex", rowGap: "1rem", flexDirection: "column" }
              : { display: "none" }
          }
        >
          <PropertyRender
            styleItem="flexDirection"
            styleText="Direction"
            styleArray={directionValues}
            patchCb={props.patchCb}
            styles={props.styles}
          >
            <RightArrow />
            <DownArrow />
            <LeftArrow />
            <UpArrow />
          </PropertyRender>
          <PropertyRender
            styleItem="alignItems"
            styleText="Align-items"
            styleArray={alignItemValues}
            patchCb={props.patchCb}
            styles={props.styles}
          >
            <FlexStretch
              style={{
                transform: props.styles.flexDirection?.startsWith("column")
                  ? "rotate(-90deg)"
                  : "",
              }}
            />
            <FlexStart
              style={{
                transform: props.styles.flexDirection?.startsWith("column")
                  ? "rotate(-90deg)"
                  : "",
              }}
            />
            <FlexCenter
              style={{
                transform: props.styles.flexDirection?.startsWith("column")
                  ? "rotate(-90deg)"
                  : "",
              }}
            />
            <FlexEnd
              style={{
                transform: props.styles.flexDirection?.startsWith("column")
                  ? "rotate(-90deg)"
                  : "",
              }}
            />
            <FlexBaseline
              style={{
                transform: props.styles.flexDirection?.startsWith("column")
                  ? "rotate(-90deg)"
                  : "",
              }}
            />
          </PropertyRender>

          <PropertyRender
            styleItem="justifyContent"
            styleText="Justify-content"
            styleArray={justifyContentValues}
            patchCb={props.patchCb}
            styles={props.styles}
          >
            <JCStart
              style={{
                transform:
                  props.styles.flexDirection === "column"
                    ? "rotate(90deg)"
                    : props.styles.flexDirection === "column-reverse"
                    ? "rotate(-90deg)"
                    : props.styles.flexDirection === "row-reverse"
                    ? "rotate(180deg)"
                    : "",
              }}
            />
            <JCCenter
              style={{
                transform: props.styles.flexDirection?.startsWith("column")
                  ? "rotate(90deg)"
                  : "",
              }}
            />
            <JCEnd
              style={{
                transform:
                  props.styles.flexDirection === "column"
                    ? "rotate(90deg)"
                    : props.styles.flexDirection === "column-reverse"
                    ? "rotate(-90deg)"
                    : props.styles.flexDirection === "row-reverse"
                    ? "rotate(180deg)"
                    : "",
              }}
            />
            <JCSpaceBetween
              style={{
                transform: props.styles.flexDirection?.startsWith("column")
                  ? "rotate(90deg)"
                  : "",
              }}
            />
            <JCSpaceAround
              style={{
                transform: props.styles.flexDirection?.startsWith("column")
                  ? "rotate(90deg)"
                  : "",
              }}
            />
          </PropertyRender>

          <PropertyRender
            styleItem="flexWrap"
            styleText="Wrap"
            styleArray={wrapValues}
            patchCb={props.patchCb}
            styles={props.styles}
          >
            <NoWrap />
            <Wrap />
            <WrapRev />
          </PropertyRender>

          <PropertyRender
            styleItem="alignContent"
            styleText="Align-content"
            styleArray={alignContentValues}
            patchCb={props.patchCb}
            styles={props.styles}
          >
            <ACFlexStretch />
            <ACFlexStart />
            <ACFlexCenter />
            <ACFlexEnd />
            <ACFlexSpaceBetween />
            <ACFlexSpaceAround />
          </PropertyRender>
          <div style={styles.gridContainer}>
            <div>&nbsp;</div>
            <div>Row</div>
            <div>Col</div>
            <div style={styles.optionName}>Gap</div>
            <div style={styles.gridItem}>
              <SizeInputWithUnits
                styleItem="rowGap"
                styles={props.styles}
                patchCb={props.patchCb}
                defaultValue=""
              />
            </div>
            <div style={styles.gridItem}>
              <SizeInputWithUnits
                styleItem="columnGap"
                styles={props.styles}
                patchCb={props.patchCb}
                defaultValue=""
              />
            </div>
          </div>

          <PropertyRender
            styleItem="display"
            styleText="Display"
            styleArray={displayValues}
            patchCb={props.patchCb}
            styles={props.styles}
          >
            <div style={{ ...smallText, color: gray300 }}>flex</div>
            <div style={{ ...smallText, color: gray300 }}>inline</div>
            <div style={{ ...smallText, color: gray300 }}>none</div>
          </PropertyRender>
        </div>
      </div>
    </>
  );
};
