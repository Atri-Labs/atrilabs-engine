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
import { useCallback, useMemo, useState } from "react";
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
import { ReactComponent as AddButton } from "../../assets/add.svg";
import { ReactComponent as MinusButton } from "../../assets/minus.svg";
import { GradientColorSelector } from "./GradientSelector";

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
  gradient: boolean;
};
export const solidBackgroundOptions: backgroundTypeOptions = {
  image: false,
  position: true,
  repeat: false,
  attach: true,
  origin: true,
  clip: true,
  color: true,
  gradient: false,
};
export const imageBackgroundOptions: backgroundTypeOptions = {
  image: true,
  position: true,
  repeat: true,
  attach: true,
  origin: true,
  clip: true,
  color: false,
  gradient: true,
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
  const [gradient, setGradient] = useState<
    | {
        gradientStr: string;
        index: number;
      }
    | undefined
  >(undefined);

  const gradients = useMemo(() => {
    const gradientsString = (props.styles.background as string) || "";
    const gradientsArray = gradientsString ? gradientsString.split("), ") : [];
    return gradientsArray.map((gradientStr, index) =>
      index === gradientsArray.length - 1 ? gradientStr : gradientStr + ")"
    );
  }, [props.styles.background]);

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

  const applyGradient = useCallback(
    (gradients: string[]) => {
      let gradientsString = "";
      for (let i = 0; i < gradients.length; i++) {
        if (gradientsString !== "" && i > 0) gradientsString += ", ";
        gradientsString += gradients[i];
      }
      props.patchCb({
        property: {
          styles: { background: gradientsString },
        },
      });
    },
    [props]
  );

  const addGradient = useCallback(() => {
    applyGradient([...gradients, "linear-gradient(45deg, white 0%, red 100%)"]);
  }, [applyGradient, gradients]);

  const removeGradient = useCallback(
    (index: number) => {
      const gradientValues = [...gradients];
      gradientValues.splice(index, 1);
      applyGradient(gradientValues);
    },
    [applyGradient, gradients]
  );

  const updateGradient = useCallback(
    (index: number, gradient: string) => {
      const gradientValues = [...gradients];
      gradientValues.splice(index, 1, gradient);
      applyGradient(gradientValues);
    },
    [applyGradient, gradients]
  );

  const closeGradientSelector = useCallback(() => {
    setGradient(undefined);
  }, []);

  console.log("Gradient", gradients);

  return (
    <>
      {gradient && (
        <div
          style={{
            position: "absolute",
            bottom: "0.2rem",
            right: "15.2rem",
          }}
        >
          <GradientColorSelector
            gradient={gradient.gradientStr}
            index={gradient.index}
            updateGradient={updateGradient}
            closeGradientSelector={closeGradientSelector}
          />
        </div>
      )}
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
          {/* Background gradient */}
          {backgroundTypes[selectedTypeIndex].gradient && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "1em",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ ...smallText, color: gray200, cursor: "pointer" }}
                >
                  Gradient
                </div>
                <AddButton onClick={() => addGradient()} />
              </div>
              {gradients.map((gradient, index) => (
                <div
                  key={index}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      columnGap: "1em",
                      border: "1px solid #fff",
                      padding: "0.3em",
                      width: "110px",
                    }}
                    onClick={() =>
                      setGradient({ gradientStr: gradient, index })
                    }
                  >
                    <div
                      style={{
                        width: "1em",
                        height: "1em",
                        backgroundImage: `${gradient}`,
                      }}
                    ></div>
                    <div
                      style={{
                        ...smallText,
                        color: gray200,
                        cursor: "pointer",
                      }}
                    >
                      {(gradient[0] === "r" && gradient[10] === "l") ||
                      gradient[0] === "l"
                        ? "Linear Gradient"
                        : (gradient[0] === "r" && gradient[10] === "r") ||
                          (gradient[0] === "r" && gradient[1] === "a")
                        ? "Radial Gradient"
                        : "Conic Gradient"}
                    </div>
                  </div>
                  {gradient[0] === "r" && gradient[1] === "e" ? (
                    <div
                      style={{
                        ...smallText,
                        color: gray200,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #fff",
                        padding: "0.3em",
                        width: "60px",
                      }}
                      onClick={() =>
                        updateGradient(
                          index,
                          gradient.replace("repeating-", "")
                        )
                      }
                    >
                      Repeat
                    </div>
                  ) : (
                    <div
                      style={{
                        ...smallText,
                        color: gray200,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #fff",
                        padding: "0.3em",
                        width: "60px",
                      }}
                      onClick={() =>
                        updateGradient(index, "repeating-" + gradient)
                      }
                    >
                      No Repeat
                    </div>
                  )}
                  <div
                    style={{
                      color: gray200,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      userSelect: "none",
                    }}
                    onClick={() => removeGradient(index)}
                  >
                    <MinusButton />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
