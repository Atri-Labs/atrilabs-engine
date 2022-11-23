import {
  gray100,
  gray200,
  gray400,
  gray500,
  gray800,
  agastyaLine,
  h5Heading,
  smallText,
} from "@atrilabs/design-system";
import { useCallback, useState } from "react";
import { CssProprtyComponentType } from "../../types";
import { ReactComponent as DropDownArrow } from "../../assets/layout-parent/dropdown-icon.svg";
import { AssetInputButton } from "@atrilabs/shared-layer-lib";
import { SizeInputWithUnits } from "../commons/SizeInputWithUnits";
import { ReactComponent as BRN } from "../../assets/background/none-icon.svg";
import { ReactComponent as II } from "../../assets/background/Image.svg";
import { ReactComponent as SI } from "../../assets/background/Solid.svg";
import { ReactComponent as BRR } from "../../assets/background/repeat-icon.svg";
import { ReactComponent as BRX } from "../../assets/background/repeat-x-icon.svg";
import { ReactComponent as BRY } from "../../assets/background/repeat-y-icon.svg";
import { ReactComponent as BRO } from "../../assets/background/round-icon.svg";
import { ReactComponent as BRS } from "../../assets/background/space-icon.svg";
import { ReactComponent as BAX } from "../../assets/background/fixed-icon.svg";
import { ReactComponent as BAY } from "../../assets/background/local-icon.svg";
import { ReactComponent as BAO } from "../../assets/background/scroll-icon.svg";
import { ReactComponent as BOX } from "../../assets/background/padding-box.svg";
import { ReactComponent as BOY } from "../../assets/background/content-box.svg";
import { ReactComponent as BOO } from "../../assets/background/border-box.svg";
import { ReactComponent as BCX } from "../../assets/background/padding-box-icon.svg";
import { ReactComponent as BCY } from "../../assets/background/content-box-icon.svg";
import { ReactComponent as BCO } from "../../assets/background/border-box-icon.svg";
import PropertyRender from "../commons/PropertyRender";
import MultiplePropertyRender from "../commons/MultiplePropertyRender";
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
  inputBox: {
    ...smallText,
    outline: "none",
    color: gray100,
    backgroundColor: gray800,
    width: "57px",
    height: "25px",
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
    width: "4rem",
    color: "white",
    lineHeight: "25px",
  },
  select: {
    textAlign: "left",
  },
  gridContainer: {
    ...smallText,
    color: gray400,
    display: "grid",
    gridTemplateColumns: "4rem auto auto",
    textAlign: "left",
  },
  inputContainer: {
    display: "flex",
  },
  inputContainerBox: {
    ...smallText,
    outline: "none",
    color: gray100,
    padding: "3px",
    backgroundColor: gray800,
    width: "30px",
    border: "none",
    borderRadius: "2px 0 0 2px",
    lineHeight: "20px",
  },
  inputSpan: {
    ...smallText,
    color: gray400,
    backgroundColor: gray800,
    borderRadius: "0 2px 2px 0",
    display: "flex",
    alignItems: "center",
    paddingRight: "4px",
  },
  typesContainer: {
    display: "grid",
    height: "100%",
  },
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    paddingRight: "0.4rem",
    paddingLeft: "0.4rem",
    cursor: "pointer",
  },
};
export type backgroundTypeOptions = {
  image: boolean;
  position: boolean;
  repeat: boolean;
  attach: boolean;
  origin: boolean;
  clip: boolean;
  color: boolean;
};
export const solidBackgroundOptions: backgroundTypeOptions = {
  image: false,
  position: true,
  repeat: false,
  attach: true,
  origin: true,
  clip: true,
  color: true,
};
export const imageBackgroundOptions: backgroundTypeOptions = {
  image: true,
  position: true,
  repeat: true,
  attach: true,
  origin: true,
  clip: true,
  color: false,
};
const backgroundTypes = [solidBackgroundOptions, imageBackgroundOptions];
const backgroundRepeatValues = [
  "repeat",
  "repeat-x",
  "repeat-y",
  "space",
  "round",
  "no-repeat",
];
const backgroundAttachmentValues = ["local", "fixed", "scroll"];
const backgroundOriginValues = ["content-box", "padding-box", "border-box"];
const backgroundClipValues = [
  "content-box",
  "padding-box",
  "border-box",
  "text",
];
export const Background: React.FC<CssProprtyComponentType> = (props) => {
  const [showProperties, setShowProperties] = useState<boolean>(true);

  const onBackgroundImgeClickCb = useCallback(() => {
    props.openAssetManager(["select", "upload"], "backgroundImage");
  }, [props]);
  const onBackgroundImageClearClickCb = useCallback(() => {
    props.patchCb({
      property: {
        styles: { backgroundImage: "" },
      },
    });
  }, [props]);
  const [selectedTypeIndex, setSelectedTypeIndex] = useState<number>(0);

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
        <div style={styles.header}>Background</div>
      </div>
      <div
        style={
          showProperties
            ? { display: "flex", rowGap: "1rem", flexDirection: "column" }
            : { display: "none" }
        }
      >
        {/**Background Type */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={styles.optionName}>Type</span>
          <div
            style={{
              ...styles.typesContainer,
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <div
              style={
                selectedTypeIndex === 0
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
                setSelectedTypeIndex(0);
              }}
            >
              <SI />
            </div>
            <div
              style={
                selectedTypeIndex === 1
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
                setSelectedTypeIndex(1);
              }}
            >
              <II />
            </div>
          </div>
        </div>
        {/**Background Image */}
        {backgroundTypes[selectedTypeIndex].image && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={styles.optionName}>Image</span>
            <AssetInputButton
              onClick={onBackgroundImgeClickCb}
              assetName={props.styles.backgroundImage || "Select Image"}
              onClearClick={onBackgroundImageClearClickCb}
            />
          </div>
        )}
        {/**Background Color */}
        {backgroundTypes[selectedTypeIndex].color && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <ColorComponent
              name="Background Color"
              styleItem="backgroundColor"
              styles={props.styles}
              patchCb={props.patchCb}
              openPalette={props.openPalette}
            />
          </div>
        )}
        {/**Background Position */}
        {backgroundTypes[selectedTypeIndex].position && (
          <div style={styles.gridContainer}>
            <div>&nbsp;</div>
            <div>Top</div>
            <div>Right</div>
            <div style={styles.optionName}>Position</div>
            <div>
              <SizeInputWithUnits
                styleItem="backgroundPositionY"
                styles={props.styles}
                patchCb={props.patchCb}
                defaultValue=""
              />
            </div>
            <div>
              <SizeInputWithUnits
                styleItem="backgroundPositionX"
                styles={props.styles}
                patchCb={props.patchCb}
                defaultValue=""
              />
            </div>
          </div>
        )}
        {/**Background Repeat */}
        {backgroundTypes[selectedTypeIndex].repeat && (
          <PropertyRender
            styleItem="backgroundRepeat"
            styleText="Repeat"
            styleArray={backgroundRepeatValues}
            patchCb={props.patchCb}
            styles={props.styles}
          >
            <BRR />
            <BRX />
            <BRY />
            <BRO />
            <BRS />
            <BRN />
          </PropertyRender>
        )}
        {/**Background Attach */}
        {backgroundTypes[selectedTypeIndex].attach && (
          <PropertyRender
            styleItem="backgroundAttachment"
            styleText="Attach"
            styleArray={backgroundAttachmentValues}
            patchCb={props.patchCb}
            styles={props.styles}
            defaultCSSIndex={2}
          >
            <BAY />
            <BAX />
            <BAO />
          </PropertyRender>
        )}
        {/**Background Origin */}
        {backgroundTypes[selectedTypeIndex].origin && (
          <PropertyRender
            styleItem="backgroundOrigin"
            styleText="Origin"
            styleArray={backgroundOriginValues}
            patchCb={props.patchCb}
            styles={props.styles}
            defaultCSSIndex={1}
          >
            <BOX />
            <BOY />
            <BOO />
          </PropertyRender>
        )}
        {/**Background Clip */}
        {backgroundTypes[selectedTypeIndex].clip && (
          <MultiplePropertyRender
            styleItems={["backgroundClip", "WebkitBackgroundClip"]}
            styleText="Clip"
            styleArray={backgroundClipValues}
            patchCb={props.patchCb}
            styles={props.styles}
            defaultCSSIndex={2}
          >
            <BCY />
            <BCX />
            <BCO />
            <div style={{ ...smallText, color: gray200, cursor: "pointer" }}>
              Text
            </div>
          </MultiplePropertyRender>
        )}
      </div>
    </div>
  );
};
